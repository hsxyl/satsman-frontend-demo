// import { AddressType, ToSignInput, UnspentOutput } from "../../types";
// import { Transaction } from "../transaction";
// import { addressTypeToString, getAddressType } from "../address";
// import { Edict, RuneId, Runestone, none } from "runelib";
// import { UTXO_DUST } from "../../constants";
// import {
//   estimate_min_tx_fee,
//   ocActor,
// } from "../../canister/orchestrator/actor";
// import * as bitcoin from "bitcoinjs-lib";
// import {
//   OrchestratorStatus,
//   TxOutputType,
// } from "canister/orchestrator/service.did";
// import { SATSMAN_EXCHANGE_ID } from "canister/satsman/actor";

// export async function withdrawTx({
//   userBtcUtxos,
//   runeId,
//   launchPoolBtcUtxo,
//   paymentAddress,
//   address,
//   launchPoolAddress,
//   signPsbt,
//   launchPoolNonce,
//   withdrawRuneAmount,
//   withdrawBtcAmount,
// }: {
//   userBtcUtxos: UnspentOutput[];
//   runeId: string;
//   launchPoolBtcUtxo: UnspentOutput;
//   paymentAddress: string;
//   address: string;
//   launchPoolAddress: string;
//   signPsbt: any;
//   launchPoolNonce: bigint;
//   withdrawRuneAmount: bigint;
//   withdrawBtcAmount: bigint;
// }) {
//   let feeRate = await ocActor
//     .get_status()
//     .then((res: OrchestratorStatus) => {
//       return res.mempool_tx_fee_rate.medium;
//     })
//     .catch((err) => {
//       console.log("get recommendedFeeRate error", err);
//       throw err;
//     });
//   const tx = new Transaction();

//   tx.setFeeRate(Number(feeRate.toString()));
//   tx.setEnableRBF(false);
//   tx.setChangeAddress(paymentAddress);

//   let inputTypes: TxOutputType[] = [];
//   let outputTypes: TxOutputType[] = [];

//   // input 0 launch pool utxo
//   tx.addInput(launchPoolBtcUtxo);
//   inputTypes.push(
//     addressTypeToString(getAddressType(launchPoolBtcUtxo.address))
//   );

//   // input 1-n user utxo
//   // userBtcUtxos.forEach(utxo => {
//   //     tx.addInput(utxo)
//   //     inputTypes.push(
//   //         addressTypeToString(getAddressType(utxo.address))
//   //     )
//   // })

//   // output

//   // output 0 launch pool
//   tx.addOutput(
//     launchPoolAddress,
//     BigInt(launchPoolBtcUtxo.satoshis) - withdrawBtcAmount
//   );
//   outputTypes.push(addressTypeToString(getAddressType(launchPoolAddress)));

//   // output 1, user receive rune
//   if (withdrawRuneAmount > 0) {
//     tx.addOutput(address, BigInt(UTXO_DUST));
//     outputTypes.push(addressTypeToString(getAddressType(address)));

//     // edict & op return
//     const launchPoolRune = launchPoolBtcUtxo.runes.find(
//       (rune) => rune.id === runeId
//     )!;
//     const changeRuneAmount = BigInt(launchPoolRune.amount) - withdrawRuneAmount;
//     const [runeBlock, runeIdx] = runeId.split(":");

//     const needChange = changeRuneAmount > 0;

//     const edicts = needChange
//       ? [
//           new Edict(
//             new RuneId(Number(runeBlock), Number(runeIdx)),
//             changeRuneAmount,
//             0
//           ),
//           new Edict(
//             new RuneId(Number(runeBlock), Number(runeIdx)),
//             withdrawRuneAmount,
//             1
//           ),
//         ]
//       : [
//           new Edict(
//             new RuneId(Number(runeBlock), Number(runeIdx)),
//             withdrawRuneAmount,
//             1
//           ),
//         ];

//     const runestone = new Runestone(edicts, none(), none(), none());

//     console.log({ runestone });

//     const opReturnScript = runestone.encipher();

//     // OP_RETURN
//     tx.addScriptOutput(opReturnScript, BigInt(0));
//   }

//   // user input as tx fee
//   console.log("userBtcUtxos", { userBtcUtxos });
//   let userBtcAmount = BigInt(0);
//   let fee = BigInt(0);
//   for (let i = 0; i < userBtcUtxos.length && i < 10; i++) {
//     const utxo = userBtcUtxos[i]!;
//     tx.addInput(utxo);
//     inputTypes.push(addressTypeToString(getAddressType(utxo.address)));
//     userBtcAmount += BigInt(utxo.satoshis);
//     fee = await estimate_min_tx_fee(
//       inputTypes,
//       [launchPoolAddress],
//       outputTypes
//     );
//     fee = fee + fee;
//     if (userBtcAmount >= fee + UTXO_DUST + UTXO_DUST) break;
//   }
//   if (userBtcAmount < fee) {
//     throw new Error("Insufficient UTXO(s), userBtcAmount:" + userBtcAmount + "," + (fee + UTXO_DUST + UTXO_DUST));
//   }

//   let change_amount =
//     BigInt(userBtcAmount) -
//     fee -
//     (withdrawRuneAmount > 0 ? UTXO_DUST : BigInt(0)) +
//     withdrawBtcAmount;

//     console.log("change amount", {change_amount, userBtcAmount, fee, withdrawBtcAmount, withdrawRuneAmount})

//   if (change_amount < 0) {
//     throw new Error("Insufficient UTXO(s)");
//   } else if (change_amount <= UTXO_DUST) {
//     outputTypes.pop();
//   } else {
//     tx.addOutput(paymentAddress, change_amount);
//   }

//   const inputs = tx.getInputs();
//   const psbt = tx.toPsbt();
//   //@ts-expect-error: todo
//   const unsignedTx = psbt.__CACHE.__TX;
//   const toSignInputs: ToSignInput[] = [];
//   const unsignedTxClone = unsignedTx.clone();

//   for (let i = 0; i < toSignInputs.length; i++) {
//     const toSignInput = toSignInputs[i]!;

//     const toSignIndex = toSignInput.index;
//     const input = inputs[toSignIndex];
//     const inputAddress = input!.utxo.address;
//     if (!inputAddress) continue;
//     const redeemScript = psbt.data.inputs[toSignIndex]!.redeemScript;
//     const addressType = getAddressType(inputAddress);

//     if (redeemScript && addressType === AddressType.P2SH_P2WPKH) {
//       const finalScriptSig = bitcoin.script.compile([redeemScript!]);
//       unsignedTxClone.setInputScript(toSignIndex, finalScriptSig);
//     }
//   }

//   const txid = unsignedTxClone.getId();
//   const psbtBase64 = psbt.toBase64();
//   const res = await signPsbt(psbtBase64);
//   let signedPsbtHex = res?.signedPsbtHex;

//   let output_coins = []
//   if (withdrawBtcAmount > 0) {
//     output_coins.push({
//         to: paymentAddress,
//         coin: {
//           id: "0:0",
//           value: withdrawBtcAmount,
//         },
//       })
//   }
//   if (withdrawRuneAmount > 0) {
//     output_coins.push({
//         to: address,
//         coin: {
//           id: runeId,
//           value: withdrawRuneAmount,
//         },
//       })
//   }

//   return await ocActor
//     .invoke({
//       intention_set: {
//         tx_fee_in_sats: BigInt(fee),
//         initiator_address: paymentAddress,
//         intentions: [
//           {
//             action: "withdraw",
//             exchange_id: SATSMAN_EXCHANGE_ID,
//             input_coins: [],
//             pool_utxo_spent: [],
//             pool_utxo_received: [],
//             output_coins: output_coins,
//             pool_address: launchPoolAddress,
//             action_params: "",
//             nonce: launchPoolNonce,
//           },
//         ],
//       },
//       psbt_hex: signedPsbtHex,
//       initiator_utxo_proof: [],
//     })
//     .then((res) => {
//       if ("Err" in res) {
//         throw new Error(res.Err);
//       }
//       console.log({ res });
//       return res.Ok;
//     })
// }
