import { useLaserEyes } from "@omnisat/lasereyes";
import { useRee } from "@omnity/ree-client-ts-sdk";
import { Button } from "antd";
import { satsmanActor } from "canister/satsman/actor";
import { useLaunchPool } from "hooks/use-pool";
import { convertUnspentOutputToUtxo } from "types";
import { convertUtxo } from "utils";

export function Admin() {
  const { createTransaction, client } = useRee();
  const { address, paymentAddress, signPsbt, publicKey, paymentPublicKey } =
    useLaserEyes();

  const transfer = async () => {
    try {
      let poolAddress =
        "tb1p5xfsx89l952kjdxp50js4q6aznq5tmnrf7s737vn7a4vu70n27zslw35qu".toString();
      let pbs = (await satsmanActor.get_launch_pool(poolAddress))![0]!;

      let pool_state_res = await satsmanActor.get_pool_with_state_and_key(
        poolAddress!
      );
      if (pool_state_res.length === 0) {
        alert("No pool found for this address.");
        return;
      }

      let pool_state = pool_state_res[0][0]!;
      let key = pool_state_res[0][1]!;

      const tx = await createTransaction();

      tx.addIntention({
        poolAddress: poolAddress,
        poolUtxos: [
          convertUnspentOutputToUtxo(convertUtxo(pool_state.utxo, key)),
        ],
        action: "transfer",
        inputCoins: [],
        outputCoins: [
          {
            to: "tb1qvtcrsrsgpl443z3s7k0fez0dw7dn08fn25vwef".toString(),
            coin: {
              id: pbs.launch_plan.rune_id,
              value: BigInt(pbs.launch_plan.launch_token),
            },
          },
        ],

        nonce: pool_state.nonce + BigInt(1),
      });
      const { psbt } = await tx.build();
      const res = await signPsbt(psbt.toBase64());
      const signedPsbtHex = res!.signedPsbtHex!;
      const txid = await tx.send(signedPsbtHex);
      console.log("invoke success and txid ", txid);
      alert("Topup Success: " + txid);
    } catch (e) {
      console.error("invoke failed:", e);
      alert("Topup Failed: " + e);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>

      <input></input>
      <Button onClick={transfer}>Transfer</Button>
    </div>
  );
}
