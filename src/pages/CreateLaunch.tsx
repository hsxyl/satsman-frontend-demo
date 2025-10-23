import { useLaserEyes } from "@omnisat/lasereyes";
import { useRee } from "@omnity/ree-client-ts-sdk";
import {
  Button,
  Divider,
  Dropdown,
  Form,
  FormProps,
  Input,
  Select,
  Skeleton,
  Space,
  Switch,
} from "antd";
import { convertMaestroUtxo } from "api/maestro";
import { indexerActor } from "canister/runes-indexer/actor";
import { satsmanActor } from "canister/satsman/actor";
import { useLatestBlockHeight } from "hooks/use-mempool";
import { useConfig, useLaunchPools } from "hooks/use-pool";
import { useLoginUserBtcUtxo } from "hooks/use-utxos";
import { useEffect, useMemo, useState } from "react";
import { convertUtxo, createTx } from "utils";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import _ from "lodash";
import { RuneEntry } from "canister/runes-indexer/service.did";

type FieldType = {
  rune_name?: string;
  token_for_auction?: string;
  lp_percentage?: string;
  token_for_lp?: string;
  raising_target_sats?: number;
  income_distribution?: IncomeDistributionItem[];
  auction_start_height?: number;
  span_blocks?: string;
};

type IncomeDistributionItem = {
  label: string;
  percentage: number;
  address: string;
};

function rune_etch_end(runeEntry: RuneEntry): number | null {
  if (runeEntry.terms.length === 0) {
    return null;
  }

  const terms = runeEntry.terms[0];

  const relative =
    terms.offset[1].length > 0 ? runeEntry.block + terms.offset[1][0]! : null;

  const absolute = terms.height?.[1] ?? null;

  if (relative !== null && absolute !== null) {
    return Math.min(Number(relative), Number(absolute));
  }

  if (relative !== null) {
    return Number(relative);
  }

  if (absolute !== null) {
    return Number(absolute);
  }

  return null;
}

function finished_mintable_rune_amount(
  runeEntry: RuneEntry,
  latestBlockHeight: number,
  finalize_threshold: number
): boolean {
  if (runeEntry.terms.length === 0) {
    return true;
  }
  let end = rune_etch_end(runeEntry);
  if (end !== null) {
    if (latestBlockHeight >= end + finalize_threshold) {
      return true;
    }
  }

  let cap = runeEntry.terms[0]!.cap[0] ?? 0;

  if (runeEntry.mints >= cap) {
    return true;
  }

  return false;
}

function runeSupply(runeEntry: RuneEntry): bigint {
  //   if (runeEntry.terms.length === 0) {
  //     return BigInt(0);
  //   }
  let amount = runeEntry.terms[0]?.amount[0] ?? BigInt(0);

  return runeEntry.premine + runeEntry.mints * amount - runeEntry.burned;
}

export function CreateLaunch() {
  const [lpPercentage, setLpPercentage] = useState<number | undefined>(undefined);
  const [tokenForAuction, setTokenForAuction] = useState<string>("");
  const [tokenForLp, setTokenForLp] = useState<string>("Wait For Calculation...");
  const [runeInfo, setRuneInfo] = useState<RuneEntry | undefined>(undefined);
  const [runeName, setRuneName] = useState<string>("");
  const [isMeme, setIsMeme] = useState<boolean>(false);
  const [calling, setCalling] = useState<boolean>(false);
  const {
    data: config,
    isLoading: isConfigLoading,
    error: configError,
  } = useConfig();

  const runeNameChanged = async (value: string) => {
    console.log("rune name changed:", value);
    setRuneName(value);
    let rune = await indexerActor.get_rune(value);
    console.log("get rune info from indexer", { rune });
    if (rune.length > 0) {
      setRuneInfo(rune[0]);
    }
  };

  //   const { data: btcUtxos, isLoading: isLoadingUtxo } = useLoginUserBtcUtxo();
  const {
    data: latestBlockHeight,
    isLoading: isLoadingLatestBlockHeight,
    error: latestBlockHeightError,
  } = useLatestBlockHeight();

  const [isFinishedMint, supply] = useMemo(() => {
    if (!runeInfo || !latestBlockHeight || !config) {
      return [undefined, undefined];
    }
    let finished = finished_mintable_rune_amount(
      runeInfo,
      latestBlockHeight,
      Number(config!.finalize_threshold)
    );
    let sup = runeSupply(runeInfo);
    if (isMeme) {
      setTokenForAuction(((sup * BigInt(51)) / BigInt(100)).toString());
      setTokenForLp(((sup * BigInt(49)) / BigInt(100)).toString());
      console.log({
        tokenForAuction: ((sup * BigInt(51)) / BigInt(100)).toString(),
        tokenForLp: ((sup * BigInt(49)) / BigInt(100)).toString(),
      });
    } else {
        setTokenForAuction("");
        setTokenForLp("Wait For Calculation...");
    }
    return [finished, sup];
  }, [latestBlockHeight, runeInfo, config, isMeme]);

  useEffect(() => {
    console.log({ lpPercentage, tokenForAuction });
    if (!lpPercentage || !tokenForAuction || isMeme) {
      return;
    }
    setTokenForLp(((BigInt(tokenForAuction) * BigInt(lpPercentage)) / BigInt(100)).toString());
  }, [lpPercentage, tokenForAuction, isMeme]);

  const { signPsbt } = useLaserEyes();
  const { createTransaction, address, paymentAddress } = useRee();

  const loading = isConfigLoading || isLoadingLatestBlockHeight;
  const error = configError || latestBlockHeightError;

  console.log({ config, latestBlockHeight });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("onFinish:", values);
    setCalling(true);
    try {
      if (!address || !paymentAddress) {
        alert("Please connect your wallet first.");
        return;
      }
      let create_launch_state = await satsmanActor.get_create_launch_info();

      let rune = await indexerActor.get_rune(runeName!);
      let rune_id = rune[0]!.rune_id;
      const tx = await createTransaction();
      //   let poolUtxo = convertUtxo(
      //     create_launch_state.utxo,
      //     create_launch_state.key
      //   );
      let action_params = {
        rune_name: runeName,
        rune_id: rune_id,
        token_for_auction: tokenForAuction,
        token_for_lp: tokenForLp,
        income_for_lp_percentage: lpPercentage,
        income_distribution: (values.income_distribution ?? []).map((item) => ({
          label: item.label,
          percentage: Number(item.percentage!),
          address: item.address,
        })),

        description: null,
        social_info: {
          twitter: null,
          github: null,
          discord: null,
          telegram: null,
          website: null,
        },
        start_height: Number(values.auction_start_height!),
        span_blocks: Number(values.span_blocks!),
        raising_target_sats: values.raising_target_sats! * 1000,
        banner: null,
        is_meme_template: isMeme,
      };

      console.log({ action_params: JSON.stringify(action_params) });
      //   return

      let new_pool_address = await satsmanActor.new_pool(paymentAddress);
      let total_rune_amount =
        BigInt(tokenForAuction!) + BigInt(tokenForLp!);
      console.log({ new_pool_address, rune_id, total_rune_amount });
      tx.addIntention({
        poolAddress: new_pool_address,
        poolUtxos: [],
        action: "create_launch",
        inputCoins: [
          {
            from: paymentAddress,
            coin: {
              id: "0:0",
              value: create_launch_state.create_pool_fee,
            },
          },
          {
            from: paymentAddress,
            coin: {
              id: rune_id,
              value:
                BigInt(tokenForAuction!) +
                BigInt(tokenForLp!),
            },
          },
        ],
        outputCoins: [],
        actionParams: JSON.stringify(action_params),
        nonce: BigInt(0),
      });

      const { psbt } = await tx.build();
      const res = await signPsbt(psbt.toBase64());
      const signedPsbtHex = res!.signedPsbtHex!;
      const txid = await tx.send(signedPsbtHex);

      console.log("invoke success and txid ", txid);
      alert("Create Launch Success: " + txid);
      window.location.assign(`/`);
    } catch (e) {
      console.error(e);
      alert("Create Launch failed: " + (e as Error).message);
    } finally {
      setCalling(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#f0f2f5]">
      <Form onFinish={onFinish} layout="horizontal" style={{ maxWidth: 600 }}>
        <h1 className="text-2xl my-4">Token Information</h1>
        <Form.Item name="rune_name" label="Rune Name: ">
          <Input
            value={runeName}
            onChange={(e) => runeNameChanged(e.target.value)}
            placeholder="MY•TOKEN•NAME"
          />
          {isFinishedMint === undefined ? (
            <Skeleton active paragraph={false} />
          ) : (
            <span>{"Rune Supply" + supply}</span>
          )}
        </Form.Item>
        {isFinishedMint !== undefined && isFinishedMint === false && (
          <span className="text-red-500">Mint not finished</span>
        )}

        <div className="border-t border-b border-gray-300 my-4 border-dashed" />

        <h1 className="text-2xl my-4">Launch Plan</h1>

        <div className="my-2">
          <span className="mr-2">fair launch</span>
          <Switch checked={isMeme} onChange={setIsMeme} />
        </div>

        <Form.Item name="token_for_auction" label="Token for Auction: ">
          {isMeme ? (
            <span>{tokenForAuction}</span>
          ) : (
            // <input
            // // readOnly={isMeme}
            // value={tokenForAuction}
            // placeholder="Waiting for Calculation..."
            // />
            <Input
            value={tokenForAuction}
            onChange={(e) => setTokenForAuction(e.target.value)}
              placeholder={`At least ${
                supply && (supply * BigInt(5)) / BigInt(100)
              }`}
            />
          )}
        </Form.Item>

        <Form.Item name="raising_target_sats" label="Raising Target(K sats): ">
          <Input
            placeholder={`${Number(config!.minimum_raising_target) / 1000} - ${
              Number(config!.maximum_raising_target) / 1000
            }`}
          />
        </Form.Item>
        <Form.Item name="auction_start_height" label="Auction Start Height">
          <Input
            placeholder={`${
              latestBlockHeight! + config!.minimum_start_height_offset
            } - ${latestBlockHeight! + config!.maximum_start_height_offset}`}
          />
        </Form.Item>
        <Form.Item name="span_blocks" label="Span Blocks">
          <Select>
            {Array.from(config!.launch_span_options).map((value) => {
              return (
                <Select.Option value={value.toString()}>{value} </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        {!isMeme && (
          <>
            <Form.Item name="lp_percentage" label="Auction Income for LP (%): ">
              <Input
                value={lpPercentage}
                onChange={(e) => setLpPercentage(Number(e.target.value))}
                placeholder={`${
                  config!.minimum_auction_income_for_lp_percentage
                }-${
                  100 -
                  Number(config!.exchange_fee_percentage) -
                  Number(config!.referral_bonus_percentage)
                }`}
              />
            </Form.Item>
          </>
        )}

        <Form.Item name="token_for_lp" label="Token for Lp: ">
            <span>{tokenForLp}</span>
        </Form.Item>
        {!isMeme && (
          <>
            <p className="mr-4">{100 - (lpPercentage??0) - (config?.exchange_fee_percentage??0) - (config?.referral_bonus_percentage??0)}% token auction income will be receive by:</p>
            <Form.List name="income_distribution">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "label"]}
                        rules={[{ required: true, message: "Missing label" }]}
                      >
                        <Input placeholder="Label" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "percentage"]}
                        rules={[
                          { required: true, message: "Missing percentage" },
                        ]}
                      >
                        <Input placeholder="Percentage" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "address"]}
                        rules={[{ required: true, message: "Missing address" }]}
                      >
                        <Input placeholder="Address" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Item
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        )}
        <Form.Item>
          <Button loading={calling} type="primary" htmlType="submit">
            Kick off Launch
          </Button>
        </Form.Item>
      </Form>

      {/* <Button
        onClick={async () => {
          setCalling(true);
          try {
            if (!address || !paymentAddress) {
              alert("Please connect your wallet first.");
              return;
            }
            let create_launch_state =
              await satsmanActor.get_create_launch_info();

            const tx = await createTransaction();
            let poolUtxo = convertUtxo(
              create_launch_state.utxo,
              create_launch_state.key
            );
            tx.addIntention({
              poolAddress: create_launch_state.register_pool_address,
              poolUtxos: [
                {
                  txid: poolUtxo.txid,
                  vout: poolUtxo.vout,
                  satoshis: poolUtxo.satoshis.toString(),
                  runes: poolUtxo.runes,
                  address: poolUtxo.address,
                  scriptPk: poolUtxo.scriptPk,
                },
              ],
              action: "create_launch",
              inputCoins: [
                {
                  from: paymentAddress,
                  coin: {
                    id: "0:0",
                    value: create_launch_state.create_pool_fee,
                  },
                },
              ],
              outputCoins: [],
              actionParams: JSON.stringify({
                launch_args: {
                  start_height: Number(startHeight),
                  raising_target_sats: Number(raisingTarget) * 1000,
                  social_info: {},
                },
                launch_rune_etching_args: {
                  rune_name: runeName,
                },
              }),
              nonce: create_launch_state.nonce,
            });

            const { psbt } = await tx.build();
            const res = await signPsbt(psbt.toBase64());
            const signedPsbtHex = res!.signedPsbtHex!;
            const txid = await tx.send(signedPsbtHex);

            console.log("invoke success and txid ", txid);
            alert("Create Launch Success: " + txid);
            window.location.assign(`/`);
          } catch (e) {
            console.error(e);
            alert("Create Launch failed: " + (e as Error).message);
          } finally {
            setCalling(false);
          }
        }}
        type="primary"
        // disabled={!runeName || !startHeight || !raisingTarget}
        loading={calling}
      >
        Kick-off Launch
      </Button> */}
    </div>
  );
}
