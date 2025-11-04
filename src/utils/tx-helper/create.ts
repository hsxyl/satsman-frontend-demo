// import { Edict, RuneId, Runestone, none } from "runelib";
// import {
//   estimate_min_tx_fee,
//   ocActor,
// } from "../../canister/orchestrator/actor";
// import { BITCOIN, UTXO_DUST } from "../../constants";
// import { AddressType, LaunchArgs, LaunchRuneEtchingArgs, ToSignInput, UnspentOutput } from "../../types";
// import { addressTypeToString, getAddressType } from "../address";
// import { Transaction } from "../transaction";
// import * as bitcoin from "bitcoinjs-lib";
// import {
//   InputCoin,
//   InvokeArgs,
//   OrchestratorStatus,
//   OutputCoin,
//   TxOutputType,
// } from "../../canister/orchestrator/service.did";
// import { SATSMAN_CANISTER_ID, SATSMAN_EXCHANGE_ID } from "../../canister/satsman/actor";

// export async function createTx({
//   userBtcUtxos,
//   poolBtcUtxo,
//   paymentAddress,
//   poolAddress,
//   createFee,
//   nonce,
//   signPsbt,
//   launch_rune_etching_args,
//   launch_args,
// }: {
//   userBtcUtxos: UnspentOutput[];
//   poolBtcUtxo: UnspentOutput;
//   paymentAddress: string;
//   poolAddress: string;
//   createFee: bigint;
//   nonce: bigint;
//   signPsbt: any;
//   launch_rune_etching_args: LaunchRuneEtchingArgs;
//   launch_args: LaunchArgs;
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
//   let inputTypes: TxOutputType[] = [];
//   let outputTypes: TxOutputType[] = [];

//   tx.setFeeRate(Number(feeRate.toString()));
//   tx.setEnableRBF(false);
//   tx.setChangeAddress(paymentAddress);

//   // input 0 pool utxo
//   tx.addInput(poolBtcUtxo);
//   inputTypes.push(addressTypeToString(getAddressType(poolBtcUtxo.address)));

//   // input 1-n user utxo

//   // userBtcUtxos.forEach(utxo => {
//   //     tx.addInput(utxo)
//   //     inputTypes.push(
//   //         addressTypeToString(getAddressType(utxo.address))
//   //     )
//   // })

//   // add register fee to pool address

//   // output 0 pool address
//   tx.addOutput(poolAddress, BigInt(poolBtcUtxo.satoshis) + createFee);
//   outputTypes.push(addressTypeToString(getAddressType(poolAddress)));

//   // Output 1: change user utxo
//   outputTypes.push(addressTypeToString(getAddressType(paymentAddress)));

//   let userBtcAmount = BigInt(0);
//   let fee = BigInt(0);
//   for (let i = 0; i < userBtcUtxos.length && i < 10; i++) {
//     const utxo = userBtcUtxos[i]!;
//     tx.addInput(utxo);
//     inputTypes.push(addressTypeToString(getAddressType(utxo.address)));
//     userBtcAmount += BigInt(utxo.satoshis);
//     fee = await estimate_min_tx_fee(inputTypes, [poolAddress], outputTypes);
//     fee = fee + fee;
//     if (userBtcAmount >= fee) break;
//   }
//   if (userBtcAmount < fee) {
//     throw new Error("Insufficient UTXO(s)");
//   }

//   console.log({ tx });

//   // let fee = await ocActor.estimate_min_tx_fee({
//   //     'input_types': inputTypes,
//   //     'pool_address': [poolAddress],
//   //     'output_types': outputTypes,
//   // }).then((res: { 'Ok': bigint } | { 'Err': string }) => {
//   //     if ('Err' in res) {
//   //         throw new Error(res.Err);
//   //     }
//   //     return res.Ok
//   // }).catch((err) => {
//   //     console.log("invoke error", err);
//   //     throw err;
//   // });

//   // fee = fee + fee + fee;
//   // let fee = await Orchestrator.getEstimateMinTxFee({
//   //     input_types: inputTypes,
//   //     pool_address: poolAddress,
//   //     output_types: outputTypes,
//   // });
//   // let fee = BigInt(221);

//   let change_amount = BigInt(userBtcAmount) - BigInt(createFee) - fee;
//   console.log({ change_amount });
//   if (change_amount < 0) {
//     throw new Error("Inssuficient UTXO(s)");
//   } else if (change_amount <= UTXO_DUST) {
//     outputTypes.pop();
//   } else {
//     tx.addOutput(paymentAddress, change_amount);
//   }

//   console.log({ tx });
//   const inputs = tx.getInputs();
//   const psbt = tx.toPsbt();
//   //@ts-expect-error: todo
//   const unsignedTx = psbt.__CACHE.__TX;
//   // let _txid = unsignedTx.getId()
//   // console.log({_txid})
//   const toSignInputs: ToSignInput[] = [];
//   const toSpendUtxos = inputs
//     .filter(({ utxo }, index) => {
//       const isUserInput =
//         utxo.address === paymentAddress || utxo.address === paymentAddress;
//       const addressType = getAddressType(utxo.address);
//       if (isUserInput) {
//         toSignInputs.push({
//           index,
//           ...(addressType === AddressType.P2TR
//             ? { address: utxo.address, disableTweakSigner: false }
//             : { publicKey: utxo.pubkey, disableTweakSigner: true }),
//         });
//       }
//       return isUserInput;
//     })
//     .map((input) => input.utxo);

//   const unsignedTxClone = unsignedTx.clone();

//   for (let i = 0; i < toSignInputs.length; i++) {
//     const toSignInput = toSignInputs[i];

//     const toSignIndex = toSignInput!.index;
//     const input = inputs[toSignIndex];
//     const inputAddress = input!.utxo.address;
//     if (!inputAddress) continue;
//     const redeemScript = psbt.data.inputs[toSignIndex]!.redeemScript;
//     const addressType = getAddressType(inputAddress);

//     if (redeemScript && addressType === AddressType.P2SH_P2WPKH) {
//       const finalScriptSig = bitcoin.script.compile([redeemScript]);
//       unsignedTxClone.setInputScript(toSignIndex, finalScriptSig);
//     }
//   }

//   const txid = unsignedTxClone.getId();
//   console.log({ txid });
//   const psbtBase64 = psbt.toBase64();
//   const res = await signPsbt(psbtBase64);
//   let signedPsbtHex = res?.signedPsbtHex;

//   let invoke_arg: InvokeArgs = {
//     initiator_utxo_proof: [],
//     psbt_hex: signedPsbtHex,
//     intention_set: {
//       tx_fee_in_sats: BigInt(fee),
//       initiator_address: paymentAddress,
//       intentions: [
//         {
//           action: "create_launch",
//           exchange_id: SATSMAN_EXCHANGE_ID,
//           input_coins: [
//             {
//               from: paymentAddress,
//               coin: {
//                 id: BITCOIN.id,
//                 value: createFee,
//               },
//             },
//           ],
//           output_coins: [],
//           action_params: JSON.stringify({
//             launch_args,
//             launch_rune_etching_args,
//           }),
//           nonce: BigInt(nonce),
//           pool_utxo_spent: [],
//           pool_utxo_received: [],
//           pool_address: poolAddress,
//         },
//       ],
//     },
//   };

//   return await ocActor
//     .invoke(invoke_arg)
//     .then((res) => {
//       if ("Err" in res) {
//         throw new Error(res.Err);
//       }
      
//       return res.Ok;
//     })
//     .catch((err) => {
//       console.log("invoke error", err);
//       alert("Create Pool Failed: " + err);
//       // reload page
//       window.location.reload();
//       throw err;
//     });
// }
