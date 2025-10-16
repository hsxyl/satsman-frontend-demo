import { useLaserEyes } from "@omnisat/lasereyes";
import { Button, Divider, Form, FormProps, Input, Skeleton } from "antd";
import Search from "antd/es/input/Search";
import { convertMaestroUtxo } from "api/maestro";
import { swapActor } from "canister/rich-swap/actor";
import { PoolBasic } from "canister/rich-swap/service.did";
import {
  pool_status_number,
  pool_status_str,
  SATSMAN_CANISTER_ID,
  satsmanActor,
  satsmanActorWithIdentity,
} from "canister/satsman/actor";
import {
  LaunchpadState,
  PoolBusinessStateView,
} from "canister/satsman/service.did";
import {
  useEtchingRequest,
  useLaunchPool,
  useUserInfoOfLaunch,
} from "hooks/use-pool";
import { useLoginUserBtcUtxo, useWalletBtcUtxos } from "hooks/use-utxos";
// @ts-ignore
import { useSiwbIdentity } from "oct-ic-siwb-lasereyes-connector";
import { use, useEffect, useMemo, useState } from "react";
import { convertUtxo } from "utils";
import { addLiquidityTx } from "utils/tx-helper/addLp";
import { topupTx } from "utils/tx-helper/topup";
import { withdrawTx } from "utils/tx-helper/withdraw";

export function Launch() {
  const urlParams = new URLSearchParams(window.location.search);
  const pool_address =
    urlParams.get("pool_address") ||
    window.location.pathname.split("/launch/")[1];

  console.log({ pool_address });
  const {
    data: pool_business_state,
    isLoading,
    error,
  } = useLaunchPool(pool_address);

  const loading = useMemo(() => {
    return isLoading;
  }, [isLoading]);

  const anyError = useMemo(() => {
    return error;
  }, [error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (anyError) {
    return <div>Error: {anyError.message}</div>;
  }

  console.log({ pool_business_state });

  const status_str = pool_status_str(pool_business_state![0]!.status);
  const status_number = pool_status_number(pool_business_state![0]!.status);
  console.log({ status_str, status_number });

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-[#f0f2f5]">
      {/* {status_number >= 3 && ( */}
      <div className="my-4 w-full max-w-2xl bg-white p-6 rounded shadow">
        <LaunchManager pool_business_state={pool_business_state![0]!} />
      </div>
      {/* )} */}
      {status_number > 5 && (
        <div className="my-4 w-full max-w-2xl bg-white p-6 rounded shadow">
          <LaunchSuccess pool_business_state={pool_business_state![0]!} />
        </div>
      )}
      {status_number >= 4 && (
        <div className="my-4 w-full max-w-2xl bg-white p-6 rounded shadow">
          <UserManager pool_business_state={pool_business_state![0]!} />
        </div>
      )}
    </div>
  );
}

function UserManager({
  pool_business_state,
}: {
  pool_business_state: PoolBusinessStateView;
}) {
  const { identity } = useSiwbIdentity();
  const [topupAmount, setTopupAmount] = useState<number | undefined>();
  const { address, paymentAddress, signPsbt, publicKey, paymentPublicKey } =
    useLaserEyes();
  const {
    data: btcUtxos,
    isLoading: isLoadingUtxo,
    isError: isErrorUtxo,
    error: errorUtxo,
  } = useLoginUserBtcUtxo();
  const {
    data: userInfoOfLaunch,
    isLoading: isLoadingUserInfo,
    isError: isErrorUserInfo,
    error: errorUserInfo,
    refetch: refetchUserInfo,
  } = useUserInfoOfLaunch(pool_business_state.pool_address, address);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string | undefined>(
    userInfoOfLaunch?.referred_by_code?.[0]
  );
  const [calling, setCalling] = useState<boolean>(false);
  const [tune, setTune] = useState<number | undefined>(userInfoOfLaunch?.tune);
  const status_str = pool_status_str(pool_business_state.status);

  useEffect(() => {
    setReferralCode(userInfoOfLaunch?.referred_by_code?.[0]);
  }, [userInfoOfLaunch]);

  const isLoading = useMemo(() => {
    return isLoadingUtxo || isLoadingUserInfo;
  }, [isLoadingUtxo, isLoadingUserInfo]);
  const isError = useMemo(() => {
    return isErrorUtxo || isErrorUserInfo;
  }, [isErrorUtxo, isErrorUserInfo]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <div>
        Error loading user info or utxos,{" "}
        {errorUserInfo?.message || errorUtxo?.message}
      </div>
    );
  }

  if (!address) {
    return (
      <div>
        <h2 className="text-black text-2xl font-bold mb-4">User Manager</h2>
        <p className="text-yellow-700">Please connect your wallet first.</p>
      </div>
    );
  }

  console.log({ userInfoOfLaunch });

  const account = userInfoOfLaunch?.account?.[0];

  return (
    <div>
      <h2 className="text-black text-2xl font-bold mb-4">User Manager</h2>
      <p>
        User Balance:{" "}
        {(account?.btc_balance ?? BigInt(0)) -
          (account?.used_btc_balance ?? BigInt(0))}
      </p>
      <p>
        User Contributed Amount: {account?.total_contributed_btc ?? BigInt(0)}
      </p>
      <p>
        User Received Rune:{" "}
        {userInfoOfLaunch?.account?.[0]?.minted_rune_amount || 0}
      </p>
      <p>User Referral Reward: {account?.referral_reward}</p>

      {userInfoOfLaunch?.my_referral_code.length === 1 ? (
        <p className="mb-8">
          Your Referral Code:{" "}
          <span className="text-blue-500 font-mono">
            {userInfoOfLaunch?.my_referral_code[0]}
          </span>
        </p>
      ) : (
        <div className="mb-4">
          <Button
            loading={isGenerating}
            onClick={async () => {
              try {
                if (!address) {
                  alert("Please connect your wallet first.");
                  return;
                }
                setIsGenerating(true);
                await satsmanActor.generate_referral_code(address!);
                refetchUserInfo();
              } catch (e) {
                alert("Generate Referral Code Failed: " + e);
                console.error(e);
              } finally {
                setIsGenerating(false);
              }
            }}
          >
            Generate Your Referral Code
          </Button>
        </div>
      )}

      {status_str === "AddedLp" && (
        <div className="my-8">
          <Button
            loading={calling}
            disabled={account?.withdrawn}
            onClick={async () => {
              try {
                setCalling(true);
                let pool_state_res =
                  await satsmanActor.get_pool_with_state_and_key(
                    pool_business_state.pool_address!
                  );
                if (pool_state_res.length === 0) {
                  throw "No pool found for this address.";
                }
                let pool_state = pool_state_res[0][0]!;
                let key = pool_state_res[0][1]!;

                let account = userInfoOfLaunch?.account?.[0];

                console.log("btcUtxos before withdraw", { btcUtxos });

                await withdrawTx({
                  userBtcUtxos: btcUtxos!.map((e) =>
                    convertMaestroUtxo(e, paymentPublicKey)
                  ),
                  runeId: pool_business_state.rune_id[0]!,
                  launchPoolBtcUtxo: convertUtxo(pool_state.utxo, key),

                  paymentAddress: paymentAddress,
                  address: address,
                  launchPoolAddress: pool_business_state.pool_address!,
                  signPsbt: signPsbt,
                  launchPoolNonce: pool_state.nonce + BigInt(1),
                  withdrawBtcAmount:
                    account!.btc_balance -
                    account!.used_btc_balance +
                    account!.referral_reward,
                  withdrawRuneAmount: account!.minted_rune_amount,
                })
                  .then((e) => {
                    console.log("invoke success and txid ", e);
                    alert("Withdraw Success: " + e);
                  })
                  .catch((e) => {
                    throw e;
                  });
              } catch (e) {
                console.error(e);
                alert("Withdraw failed: " + (e as Error).message);
              } finally {
                setCalling(false);
              }
            }}
          >
            {account?.withdrawn ? "Already Withdrawn" : "Withdraw"}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4 my-4">
        <input
          className="border text-black border-gray-300 rounded px-2 py-1"
          width={40}
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder={"Referral Code"}
        />
        <Button
          disabled={status_str !== "Processing"}
          loading={calling}
          onClick={async () => {
            try {
              setCalling(true);
              if (!address) {
                alert("Please connect your wallet first.");
                return;
              }
              if (!referralCode || referralCode.length === 0) {
                alert("Please input referral code first.");
                return;
              }
              await satsmanActorWithIdentity(identity!)
                .set_user_referral_code(
                  address!,
                  pool_business_state.pool_address,
                  referralCode
                )
                .then((e) => {
                  console.log({ e });
                  if ("Err" in e) {
                    throw new Error(e.Err.toString());
                  }
                  if ("Ok" in e) {
                    alert("Set Referral Code Success: " + JSON.stringify(e.Ok));
                  }
                });
              refetchUserInfo();
            } catch (e) {
              alert("Set Referral Code Failed: " + e);
              console.error(e);
            } finally {
              setCalling(false);
            }
          }}
        >
          Set Referral Code
        </Button>
      </div>

      <div className="flex items-center gap-4 my-4">
        <input
          className="border text-black border-gray-300 rounded px-2 py-1"
          width={40}
          value={topupAmount}
          onChange={(e) =>
            setTopupAmount(e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="At Least 1000"
        />

        <Button
          disabled={status_str !== "Processing"}
          loading={calling}
          onClick={async () => {
            try {
              setCalling(true);
              if (!address) {
                alert("Please connect your wallet first.");
                return;
              }
              let pool_state_res =
                await satsmanActor.get_pool_with_state_and_key(
                  pool_business_state.pool_address!
                );
              if (pool_state_res.length === 0) {
                alert("No pool found for this address.");
                return;
              }
              let pool_state = pool_state_res[0][0]!;
              let key = pool_state_res[0][1]!;
              topupTx({
                userBtcUtxos: btcUtxos!.map((e) =>
                  convertMaestroUtxo(e, paymentPublicKey)
                ),
                poolBtcUtxo: convertUtxo(pool_state.utxo, key),
                paymentAddress: paymentAddress!,
                poolAddress: pool_business_state.pool_address,
                topupAmount: BigInt(topupAmount!),
                nonce: pool_state.nonce + BigInt(1),
                signPsbt: signPsbt,
              })
                .then((e) => {
                  console.log("invoke success and txid ", e);
                  alert("Topup Success: " + e);
                  window.location.reload();
                })
                .catch((e) => {
                  alert("Topup Failed: " + (e as Error).message);
                });
            } catch (e) {
              console.error(e);
              alert("Topup failed: " + (e as Error).message);
            } finally {
              setCalling(false);
            }
          }}
        >
          Topup
        </Button>
      </div>

      <div className="flex items-center gap-4 my-4">
        <input
          className="border text-black border-gray-300 rounded px-2 py-1"
          width={40}
          value={tune}
          onChange={(e) =>
            setTune(e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="0-100, Default 100"
        />

        <Button
          disabled={
            !userInfoOfLaunch?.account?.length || status_str !== "Processing"
          }
          onClick={async () => {
            try {
              if (!address) {
                alert("Please connect your wallet first.");
                return;
              }
              satsmanActor.tune(
                pool_business_state.pool_address,
                address!,
                tune ?? 100
              );
            } catch (e) {
              console.error(e);
              alert("Topup failed: " + (e as Error).message);
            }
          }}
        >
          Tune
        </Button>
      </div>
    </div>
  );
}

function LaunchManager({
  pool_business_state,
}: {
  pool_business_state: PoolBusinessStateView;
}) {
  const status_number = pool_status_number(pool_business_state.status);
  console.log({ status_number });
  const status_str = pool_status_str(pool_business_state.status);

  return (
    <div>
      {/* {status_number >= 4 ? ( */}
      <LaunchInfo pool_business_state={pool_business_state} />
      {/* ) : (
        <div>
          <p>Launch Info</p>
          <p>{status_str}</p>
          <p>{pool_business_state.launch_rune_etching_args.rune_name}</p>
          <p>{pool_business_state.start_block}</p>
          <p>{pool_business_state.end_block}</p>

        </div>
        // <StartLaunch pool_address={pool_business_state.pool_address} />
      )} */}
    </div>
  );
}

function LaunchSuccess({
  pool_business_state,
}: {
  pool_business_state: PoolBusinessStateView;
}) {
  const rune_name = pool_business_state.launch_rune_etching_args.rune_name;
  const rune_id = pool_business_state.rune_id[0]!;
  const [launchSwapPool, setLaunchSwapPool] = useState<PoolBasic | undefined>(
    undefined
  );
  const { address, paymentAddress, signPsbt, publicKey, paymentPublicKey } =
    useLaserEyes();

  const { data: btcUtxos, isLoading: isLoadingUtxo } = useLoginUserBtcUtxo();
  const [calling, setCalling] = useState<boolean>(false);

  const status_str = pool_status_str(pool_business_state.status);

  useEffect(() => {
    const f = async () => {
      let pool_list = await swapActor.get_pool_list();
      let pool = pool_list.find((e) => e.name === rune_name);
      setLaunchSwapPool(pool);
    };

    f();
  }, []);

  const createPool = async () => {
    let pubkey = await swapActor.create(rune_id).then((data) => {
      if ("Ok" in data) {
        window.location.reload();
      } else {
        throw new Error(data.Err ? Object.keys(data.Err)[0] : "Unknown Error");
      }
    });
    console.log({ pubkey });
  };

  const lpStatus = () => {
    switch (status_str) {
      case "LaunchSuccess":
        return (
          <div>
            <Button
              disabled={
                !paymentAddress ||
                status_str !== "LaunchSuccess" ||
                !launchSwapPool
              }
              loading={isLoadingUtxo || calling}
              onClick={async () => {
                try {
                  setCalling(true);
                  let pool_state_res =
                    await satsmanActor.get_pool_with_state_and_key(
                      pool_business_state.pool_address!
                    );
                  if (pool_state_res.length === 0) {
                    throw "No pool found for this address.";
                  }
                  let pool_state = pool_state_res[0][0]!;
                  let key = pool_state_res[0][1]!;
                  let liquidityOffer = await swapActor
                    .pre_add_liquidity(launchSwapPool!.address, {
                      id: rune_id,
                      value: pool_business_state.rune_amount_for_lp[0]!,
                    })
                    .then((res) => {
                      if ("Ok" in res) {
                        return res.Ok;
                      } else {
                        throw new Error(
                          res.Err ? Object.keys(res.Err)[0] : "Unknown Error"
                        );
                      }
                    });

                  console.log("btc Utxos", { btcUtxos });
                  addLiquidityTx({
                    userBtcUtxos: btcUtxos!.map((e) =>
                      convertMaestroUtxo(e, paymentPublicKey)
                    ),
                    btcAmountForAddLiquidity:
                      pool_business_state.btc_amount_for_lp,
                    runeid: pool_business_state.rune_id[0]!,
                    runeAmountForAddLiquidity:
                      pool_business_state.rune_amount_for_lp[0]!,
                    launchPoolUtxo: convertUtxo(pool_state.utxo, key),
                    paymentAddress: paymentAddress,
                    swapPoolAddress: launchSwapPool!.address,
                    launchPoolAddress: pool_business_state.pool_address!,
                    signPsbt: signPsbt,
                    launchPoolNonce: BigInt(pool_state.nonce) + BigInt(1),
                    swapPoolNonce: liquidityOffer.nonce,
                  });
                } catch (e) {
                  console.log("Add Lp Error", e);
                  alert("Add Lp failed: " + (e as Error).message);
                } finally {
                  setCalling(false);
                }
              }}
            >
              {paymentAddress ? "Add Lp" : "Please Connect Wallet"}
            </Button>
          </div>
        );
      case "AddingLp":
        return <p className="text-yellow-500">Adding Liquidity...</p>;
      case "AddedLp":
        return <p className="text-green-500">Liquidity Added</p>;
      default:
        return <div>Unknown Status: {status_str}</div>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Launch Success({rune_name})</h1>
      <Divider />
      <div>
        <h2 className="text-xl font-semibold mb-2">RichSwap Pool(Created)</h2>
        {launchSwapPool ? (
          <div>
            <p>Pool Address: {launchSwapPool.address}</p>
          </div>
        ) : (
          <Button onClick={createPool}>Create RichSwap Pool</Button>
        )}
      </div>
      <Divider />
      {launchSwapPool && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Add Lp</h2>
          <p className="my-1">
            Btc Amount for Lp: {pool_business_state.btc_amount_for_lp}
          </p>
          <p className="my-1">
            Rune Amount for Lp: {pool_business_state.rune_amount_for_lp[0]}
          </p>
          {lpStatus()}
        </div>
      )}
    </div>
  );
}

function LaunchInfo({
  pool_business_state,
}: {
  pool_business_state?: PoolBusinessStateView;
}) {
  const [runeName, setRuneName] = useState<string>("");
  const [calling, setCalling] = useState<boolean>(false);
  const { identity } = useSiwbIdentity();
  let status_str = pool_status_str(pool_business_state?.status!);
  let last_block_state = pool_business_state?.highest_block_states?.[0];
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Launch Info</h2>
      <Divider />
      <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
      <div>
        <p>
          Status: {status_str}{" "}
          {status_str === "EtchFailed" && (
            <span className="text-red-500">
              ( {Object.entries(pool_business_state!.status)[0]![1]};)
            </span>
          )}
        </p>
        {status_str === "EtchFailed" && (
          <div>
            <div className="mb-4 flex flex-col items-center">
              <p className="">Please use new rune name:</p>
              <input
                value={runeName}
                onChange={(e) => {
                  setRuneName(e.target.value);
                }}
                type="text"
                className="border border-gray-300 rounded px-2 py-1 w-64"
              />
              <a
                href="https://testnet4.unisat.io/runes/inscribe?tab=etch"
                target="_blank"
                className="text-blue-500 underline ml-4"
              >
                Find Available Rune Name On Unisat
              </a>
              <Button
                loading={calling}
                onClick={async () => {
                  setCalling(true);
                  try {
                    await satsmanActorWithIdentity(identity!)
                      .re_etching(pool_business_state!.pool_address, runeName)
                      .then((r) => {
                        if ("Err" in r) {
                          throw new Error(JSON.stringify(r.Err));
                        }
                        if ("Ok" in r) {
                          alert("Re-Etch Success!");
                          window.location.reload();
                        }
                      });
                  } catch (e) {
                    console.log("Re-Etch Error", e);
                    alert("Re-Etch failed: " + (e as Error).message);
                  } finally {
                    setCalling(false);
                  }
                }}
              >
                Re-Etch
              </Button>
            </div>
          </div>
        )}
        <p>Start Block: {pool_business_state?.start_height}</p>
        <p>End Block: {pool_business_state?.end_height}</p>
        <p>
          Raising Target: {pool_business_state?.launch_args.raising_target_sats}
        </p>
        <p>Total Raised Btc: {last_block_state?.total_raised_btc_balances}</p>
        <p>Total Distributed Rune: {last_block_state?.total_minted_rune}</p>
      </div>
      <Divider />
      <h3 className="text-lg font-semibold">Rune Info</h3>
      {status_str === "Etching" ? (
        <EtchProcess pool_business_state={pool_business_state!} />
      ) : (
        <RuneInfo pool_business_state={pool_business_state!}></RuneInfo>
      )}
    </div>
  );
}

function RuneInfo({
  pool_business_state,
}: {
  pool_business_state: PoolBusinessStateView;
}) {
  return (
    <div>
      <p>Rune Name: {pool_business_state.launch_rune_etching_args.rune_name}</p>
      <p>Rune Id: {pool_business_state.rune_id}</p>
      <p>Rune Total Supply: {pool_business_state.rune_premine}</p>
    </div>
  );
}

type FieldType = {
  start_block?: number;
  end_block?: number;
  raising_target?: number;
};

// function StartLaunch({ pool_address }: { pool_address: string }) {
//   const [calling, setCalling] = useState<boolean>(false);
//   const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
//     setCalling(true);
//     satsmanActor
//       .start_launch(
//         pool_address,
//         Number(values.start_block!),
//         Number(values.end_block!),
//         BigInt(values.raising_target!)
//       )
//       .then((r) => {
//         if ("Err" in r) {
//           throw new Error(r.Err.toString());
//         }
//       })
//       .catch((e) => {
//         alert("Start Launch Failed: " + e.message);
//         console.error(e);
//       })
//       .finally(() => {
//         window.location.reload();
//       });
//   };
//   return (
//     <div>
//       <h2>Start Launch</h2>
//       <Form className="w-1/2" name="start_launch" onFinish={onFinish}>
//         <Form.Item<FieldType>
//           label="Start Block"
//           name="start_block"
//           rules={[{ required: true, message: "Please input start block!" }]}
//         >
//           <Input className="w-1/2" type="number" />
//         </Form.Item>
//         <Form.Item<FieldType>
//           label="End Block"
//           name="end_block"
//           rules={[{ required: true, message: "Please input end block!" }]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item<FieldType>
//           label="Raising Target (sats)"
//           name="raising_target"
//           rules={[{ required: true, message: "Please input raising target!" }]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item label={null}>
//           <Button loading={calling} type="primary" htmlType="submit">
//             Start
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// }

// function Etching({
//   // game_and_pool
//   pool_business_state,
// }: {
//   pool_business_state: PoolBusinessStateView;
//   // game_and_pool: GameAndPool
// }) {
//   // game.
//   const [isEtching, setIsEtching] = useState<boolean>(false);
//   const { identity } = useSiwbIdentity();

//   let commit_txid = pool_business_state.etch_commit_tx[0] || undefined;

//   return (
//     <div className="flex flex-col items-center text-black">
//       {commit_txid ? (
//         <EtchProcess
//           commit_txid={commit_txid}
//           pool_business_state={pool_business_state}
//         />
//       ) : (
//         <div className="w-100 mt-20">
//           <p>
//             Please transfer 1 $ICP to this canister before etch: <br />
//             <p className="text-blue-500 text-xl font-medium my-2">
//               {SATSMAN_CANISTER_ID}
//             </p>{" "}
//           </p>
//           <Search
//             placeholder="Rune Name"
//             enterButton="Etch"
//             loading={isEtching}
//             onSearch={(value) => {
//               setIsEtching(true);
//               satsmanActorWithIdentity(identity!)
//                 .etching_for_launch(pool_business_state.pool_address, {
//                   rune_name: value,
//                   rune_logo: {
//                     content_type: "image/png",
//                     content_base64: "",
//                   },
//                   rune_symbol: "",
//                 })
//                 .then((r) => {
//                   if ("Ok" in r) {
//                     alert("Etch Success: " + JSON.stringify(r.Ok));
//                   }
//                   if ("Err" in r) {
//                     throw new Error(r.Err.toString());
//                   }
//                 })
//                 .catch((e) => {
//                   alert("Etch Failed: " + e.message);
//                   console.error(e);
//                 })
//                 .finally(() => {
//                   // setIsEtching(false);
//                   window.location.reload();
//                 });
//             }}
//           />
//           <p className="mt-2 text-sm text-gray-500">
//             Find an usable Rune Name on
//             <a
//               className="text-blue-500 underline ml-1"
//               href="https://testnet4.unisat.io/runes/inscribe?tab=etch"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Unisat
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

function EtchProcess({
  pool_business_state,
}: {
  pool_business_state: PoolBusinessStateView;
}) {
  const { identity } = useSiwbIdentity();
  const [finalizing, setFinalizing] = useState<boolean>(false);

  const commit_txid = pool_business_state.etch_commit_tx[0] || undefined;

  const {
    data: etchingRequest,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useEtchingRequest(commit_txid);

  console.log({ etchingRequest });

  if (!commit_txid) {
    return <div>No Etch Process</div>;
  }

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return <div>Error loading etch process: {error.message}</div>;
  }

  if (!etchingRequest) {
    return <div>No Etching Request Found</div>;
  }

  if (!identity) {
    return <div>No Siwb Identity Found</div>;
  }

  const status = Object.keys(etchingRequest![0]!.status)[0];
  const isFinal = status === "Final";
  const poolStatusStr = pool_status_str(pool_business_state.status);

  return (
    <div className="mt-2 text-sm font-medium text-gray-700 flex flex-col items-start">
      <h2 className="text-lg font-bold">Etching in Progress</h2>
      <p>Rune Name: {etchingRequest![0]!.etching_args.rune_name}</p>
      <p>Premine: {etchingRequest![0]!.etching_args.premine}</p>
      <p>Commit ID: {commit_txid}</p>
      <p>Reveal ID: {etchingRequest![0]!.reveal_txid}</p>
      <p className="flex">
        Status:{" "}
        <span
          className={isFinal ? "text-green-500 ml-1" : "text-yellow-500 ml-1"}
        >
          {Object.keys(etchingRequest![0]!.status)[0]}
        </span>
      </p>
      <p>
        Create At:{" "}
        {new Date(
          Number(etchingRequest![0]!.time_at / BigInt(1000000))
        ).toLocaleString()}
      </p>

      {isFinal ? (
        <Button>Etch Finalized!</Button>
      ) : (
        <Button
          loading={isFetching}
          onClick={() => {
            refetch();
          }}
        >
          Sync
        </Button>
      )}
    </div>
  );
}
