import { useLaserEyes } from "@omnisat/lasereyes";
import { pool_status_str, satsmanActor } from "../canister/satsman/actor";
import { convertUtxo, createTx, shortenAddress } from "../utils";
import { useLoginUserBtcUtxo } from "../hooks/use-utxos";
import { convertMaestroUtxo } from "../api/maestro";
import { List } from "antd";
import { useLaunchPools } from "hooks/use-pool";
import { Link } from "react-router-dom";

export function Home() {
  // const { address, paymentAddress, signPsbt, publicKey, paymentPublicKey } =
  //   useLaserEyes();
  // const { data: btcUtxos, isLoading: isLoadingUtxo } = useLoginUserBtcUtxo();
  const { data: launchPools, isLoading: isLoadingPools } = useLaunchPools();

  console.log({ launchPools });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-[#f0f2f5]">
      <Link to="/create" className="mb-8">
        <button
          onClick={async () => {
            // try {
            //   if (!address) {
            //     alert("Please connect your wallet first.");
            //     return;
            //   }
            //   let create_launch_state =
            //     await satsmanActor.get_create_launch_info();
            //   createTx({
            //     userBtcUtxos: btcUtxos!.map((e) =>
            //       convertMaestroUtxo(e, paymentPublicKey)
            //     ),
            //     poolBtcUtxo: convertUtxo(
            //       create_launch_state.utxo,
            //       create_launch_state.key
            //     ),
            //     paymentAddress: paymentAddress!,
            //     poolAddress: create_launch_state.register_pool_address,
            //     createFee: create_launch_state.create_pool_fee,
            //     nonce: create_launch_state.nonce,
            //     signPsbt: signPsbt,
            //   }).then((e) => {
            //     console.log("invoke success and txid ", e);
            //     alert("Create Launch Success: " + e);
            //     // reload page
            //     window.location.reload();
            //   });
            // } catch (e) {
            //   console.error(e);
            //   alert("Create Launch failed: " + (e as Error).message);
            // }
          }}
          className="my-12 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Create New Launch
        </button>
      </Link>

      <List
        dataSource={launchPools || []}
        renderItem={(item) => (
          <List.Item>
            <div className="flex flex-col justify-around p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold">
                Pool Name:
                <span className="ml-2 text-sm text-blue-400">
                  {item.launch_rune_etching_args.rune_name}
                </span>
              </h3>
              <h3 className="text-lg font-semibold">
                Pool Address:
                <span className="ml-2 text-sm text-blue-400">
                  {shortenAddress(item.pool_address)}
                </span>
              </h3>
              <h3 className="text-lg font-semibold">
                Business State:
                <span className="ml-2 text-sm text-amber-700">
                  {pool_status_str(item.status)}
                </span>
              </h3>
              <h3 className="text-lg font-semibold">
                Creator:
                <span className="ml-2 text-sm text-blue-400">
                  {shortenAddress(item.creator)}
                </span>
              </h3>
              <a
                href={`/launch/${item.pool_address}`}
                className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </a>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
