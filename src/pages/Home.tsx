import { useLaserEyes } from "@omnisat/lasereyes";
import { pool_status_str, satsmanActor } from "../canister/satsman/actor";
import { convertUtxo, createTx, shortenAddress } from "../utils";
import { useLoginUserBtcUtxo } from "../hooks/use-utxos";
import { convertMaestroUtxo } from "../api/maestro";
import { List } from "antd";
import { useLaunchPools, useQueryLaunchPools } from "hooks/use-pool";
import { Link } from "react-router-dom";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useLatestBlockHeight } from "hooks/use-mempool";

export function Home() {
  // const { address, paymentAddress, signPsbt, publicKey, paymentPublicKey } =
  //   useLaserEyes();
  // const { data: btcUtxos, isLoading: isLoadingUtxo } = useLoginUserBtcUtxo();
  const { data: launchPools, isLoading: isLoadingPools } = useLaunchPools();
  const {
    data: paginatedUpcomingLaunchPools,
    isLoading: isLoadingUpcomingPaginated,
  } = useQueryLaunchPools({
    page: 1,
    page_size: 20,
    sort_by: [{TVL: null}],
    sort_order: [],
    status_filters: [{ Upcoming: null }],
    search_text: [],
  });

  const {
    data: paginatedOngoingLaunchPools,
    isLoading: isLoadingOngoingPaginated,
  } = useQueryLaunchPools({
    page: 1,
    page_size: 20,
    sort_by: [{TVL: null}],
    sort_order: [],
    status_filters: [{ Ongoing: null }],
    search_text: [],
  });

    const {
    data: paginatedCompletedLaunchPools,
    isLoading: isCompletedLaunchPaginated,
  } = useQueryLaunchPools({
    page: 1,
    page_size: 20,
    sort_by: [{EndHeight: null}],
    sort_order: [],
    status_filters: [{ Completed: null }],
    search_text: [],
  });

  const { data: latestBlockHeight } = useLatestBlockHeight();

  console.log({ launchPools, paginatedOngoingLaunchPools });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-[#f0f2f5]">
      <Link to="/create" className="mb-8">
        <button
          onClick={async () => {}}
          className="my-12 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Create New Launch
        </button>
      </Link>

      <div>
        <h1>On-going Launches</h1>
        <List
          loading={isLoadingOngoingPaginated}
          dataSource={paginatedOngoingLaunchPools?.items || []}
          renderItem={(item) => (
            <List.Item>
              <div className="border border-green-300 rounded-md p-4 mb-4 w-full bg-white text-green-800 shadow hover:shadow-lg transition-shadow">
                <h1>
                  {item.launch_plan.rune_name}
                  {item.featured && <StarFilled style={{ color: "gold" }} />}
                </h1>
                <p>
                  Duration: {item.start_height} - {item.end_height}
                </p>
                <p>
                  Raising Target:{" "}
                  {Number(item.launch_plan.raising_target_sats) / 1000} K Sats
                </p>
                <p>
                  Received:{" "}
                  {Number(
                    item.highest_block_states[0]?.total_raised_btc_balances ?? 0
                  ) / 1000}{" "}
                  K Sats
                </p>
                <p>{item.user_tunes.length} Satsman</p>
                <p>
                  paying{" "}
                  {item.highest_block_states[0]?.paying_sats_in_current_block ??
                    0}{" "}
                  S/B
                </p>
                <p>
                  price:{" "}
                  {item.highest_block_states[0]?.price_in_current_block ?? 0}{" "}
                  Sats/Rune
                </p>
                <Link to={`/launch/${item.pool_address}`}>
                  <p className="text-center text-black text-md border-2 mt-1">
                    Details
                  </p>
                </Link>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div>
        <h1>Upcoming Launches</h1>
        <List
          loading={isLoadingUpcomingPaginated}
          dataSource={paginatedUpcomingLaunchPools?.items || []}
          renderItem={(item) => (
            <List.Item>
              <div className="border border-orange-600 rounded-md p-4 mb-4 w-full bg-white text-orange-600 shadow hover:shadow-lg transition-shadow">
                <h1>
                  {item.launch_plan.rune_name}
                  {item.featured && <StarFilled style={{ color: "gold" }} />}
                </h1>
                <p>
                  Duration: {item.start_height} - {item.end_height}
                </p>
                <p>Start In: {item.start_height - latestBlockHeight!} blocks</p>

                <p>
                  Target: {Number(item.launch_plan.raising_target_sats) / 1000}{" "}
                  K Sats
                </p>
                <p>{item.user_tunes.length} Satsman</p>
                <p>
                  Deposit{" "}
                  {Number(
                    item.highest_block_states[0]
                      ?.user_total_balance_in_current_block ?? 0
                  ) / 1000}{" "}
                  K Sats
                </p>
                <Link to={`/launch/${item.pool_address}`}>
                  <p className="text-center text-black text-md border-2 mt-1">
                    Details
                  </p>
                </Link>
              </div>
            </List.Item>
          )}
        />
      </div>

       <div>
        <h1>Completed Launches</h1>
        <List
          loading={isCompletedLaunchPaginated}
          dataSource={paginatedCompletedLaunchPools?.items || []}
          renderItem={(item) => (
            <List.Item>
              <div className="border border-orange-600 rounded-md p-4 mb-4 w-full bg-white text-orange-600 shadow hover:shadow-lg transition-shadow">
                <h1>
                  {item.launch_plan.rune_name}
                  {item.featured && <StarFilled style={{ color: "gold" }} />}
                </h1>
                <p>
                  Duration: {item.start_height} - {item.end_height}
                </p>
                <p>
                  Target: {Number(item.launch_plan.raising_target_sats) / 1000}{" "}
                  K Sats
                </p>
                <p>{item.user_tunes.length} Satsman</p>
                <p>
                  Received {Number(item.highest_block_states[0]?.total_raised_btc_balances!??0) / 1000} K Sats
                  from {item.user_tunes.length} Satsman
                </p>
                <p>
                  {pool_status_str(item.status)==='LaunchSuccess' ? 'Success' : 'Failed'}
                </p>
                <Link to={`/launch/${item.pool_address}`}>
                  <p className="text-center text-black text-md border-2 mt-1">
                    Details
                  </p>
                </Link>
              </div>
            </List.Item>
          )}
        />
      </div>

    
    </div>
  );
}
