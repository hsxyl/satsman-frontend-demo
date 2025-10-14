import { useLaserEyes } from "@omnisat/lasereyes";
import { useRee } from "@omnity/ree-client-ts-sdk";
import { Button, Form, FormProps } from "antd";
import { convertMaestroUtxo } from "api/maestro";
import { indexerActor } from "canister/runes-indexer/actor";
import { satsmanActor } from "canister/satsman/actor";
import { useLatestBlockHeight } from "hooks/use-mempool";
import { useLaunchPools } from "hooks/use-pool";
import { useLoginUserBtcUtxo } from "hooks/use-utxos";
import { useState } from "react";
import { convertUtxo, createTx } from "utils";

type FieldType = {
  rune_name?: number;
  start_height?: number;
  raising_target?: number;
};

export function CreateLaunch() {
  const [runeName, setRuneName] = useState<string>("");
  const [startHeight, setStartHeight] = useState<string>("");
  const [raisingTarget, setRaisingTarget] = useState<string>("");

  const [checkingAvailability, setCheckingAvailability] =
    useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [calling, setCalling] = useState<boolean>(false);

  //   const { data: btcUtxos, isLoading: isLoadingUtxo } = useLoginUserBtcUtxo();
  const { data: latestBlockHeight } = useLatestBlockHeight();
  const { signPsbt, address, paymentAddress } = useLaserEyes();
  const { client, updateWallet, createTransaction } =
    useRee();

  console.log({ client, address, paymentAddress });

  console.log("latestBlockHeight", latestBlockHeight);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-[#f0f2f5]">
      <h1 className="text-2xl my-4">Create Launch</h1>
      <div>
        <div className="mb-4 flex flex-row items-center">
          <p className="mr-4">Rune Name:</p>
          <input
            value={runeName}
            onChange={(e) => {
              setRuneName(e.target.value);
              setIsAvailable(null);
            }}
            type="text"
            className="border border-gray-300 rounded px-2 py-1 w-64"
          />
          <a
            href="https://testnet4.unisat.io/runes/inscribe?tab=etch"
            target="_blank"
            className="text-blue-500 underline ml-4"
          >
            Find A Rune Name On Unisat
          </a>

          <Button
            loading={checkingAvailability}
            type="primary"
            className="ml-4"
            onClick={async () => {
              setCheckingAvailability(true);
              await indexerActor
                .get_rune(runeName)
                .then((res) => {
                  console.log(res);
                  if (res[0]) {
                    setIsAvailable(false);
                    alert("Sorry, this name is already taken.");
                  } else {
                    setIsAvailable(true);
                    alert("Congratulations! This name is available.");
                  }
                })
                .catch((e) => {
                  alert("Check availability failed: " + e);
                })
                .finally(() => {
                  setCheckingAvailability(false);
                });
            }}
          >
            Check Availability
          </Button>
        </div>
        <div className="mb-4 flex flex-row items-center">
          <div className="flex flex-row items-center">
            <p className="mr-4">Start Height:</p>
            <input
              placeholder={
                "At least " +
                (latestBlockHeight ? latestBlockHeight + 20 : "Current + 6")
              }
              value={startHeight}
              onChange={(e) => {
                setStartHeight(e.target.value);
              }}
              type="text"
              className="border border-gray-300 rounded px-2 py-1 w-64"
            />
          </div>
          <div className="ml-8 flex flex-row items-center">
            <p className="mr-4">End Height:</p>
            <input
              disabled
              value={
                startHeight ? parseInt(startHeight) + 1008 : "Start + 1008"
              }
              type="text"
              className="bg-gray-300 border-gray-700 rounded px-2 py-1 w-64"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-row items-center">
          <p className="mr-4">Raising Target(M S):</p>
          <input
            placeholder="10-1000 M Sats"
            value={raisingTarget}
            onChange={(e) => {
              setRaisingTarget(e.target.value);
            }}
            type="text"
            className="border border-gray-300 rounded px-2 py-1 w-64"
          />
        </div>
        <Button
          onClick={async () => {
            setCalling(true);
            try {
              if (!address) {
                alert("Please connect your wallet first.");
                return;
              }
              let create_launch_state =
                await satsmanActor.get_create_launch_info();

            updateWallet({
                address: address,
                paymentAddress: paymentAddress!,
            })

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
          disabled={!runeName || !startHeight || !raisingTarget}
          loading={calling}
        >
          Kick-off Launch
        </Button>
      </div>
    </div>
  );
}
