import { useLaserEyes } from "@omnisat/lasereyes";
import {
  pool_outcome_str,
  pool_status_str,
  satsmanActor,
} from "../canister/satsman/actor";
import { List } from "antd";
import {
  useHomePageBlockAggregationData,
  useLaunchPools,
  useQueryLaunchPools,
} from "hooks/use-pool";
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
    sort_by: [{ TVL: null }],
    sort_order: [],
    status_filters: [{ Upcoming: null }],
    search_text: [],
    featured_first: true,
  });

  const {
    data: paginatedOngoingLaunchPools,
    isLoading: isLoadingOngoingPaginated,
  } = useQueryLaunchPools({
    page: 1,
    page_size: 20,
    sort_by: [{ TVL: null }],
    sort_order: [],
    status_filters: [{ Ongoing: null }],
    search_text: [],
    featured_first: true,
  });

  const {
    data: paginatedCompletedLaunchPools,
    isLoading: isCompletedLaunchPaginated,
  } = useQueryLaunchPools({
    page: 1,
    page_size: 20,
    sort_by: [{ EndHeight: null }],
    sort_order: [],
    status_filters: [{ Completed: null }],
    search_text: [],
    featured_first: false,
  });

  const { data: latestBlockHeight } = useLatestBlockHeight();

  const { data: blockAggregationData } = useHomePageBlockAggregationData(
    latestBlockHeight ? latestBlockHeight - 6 : undefined,
    latestBlockHeight
  );

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

      <div className="flex flex-row">
        {blockAggregationData?.[0].map((dataPoint) => {
          const height = dataPoint[0];
          const data = dataPoint[1];

          return (
            <div className="border border-black m-2" key={height}>
              <p>{height}</p>
              <p>{data.ongoing_launches_count} launches</p>
              <p>{data.total_release_rune_amount} R</p>
              {/* Block Height: {height}, Data: {JSON.stringify(data)} */}
            </div>
          );
        })}
        <div className="border border-black m-2">
          <p>Satsman</p>
          <p>
            {blockAggregationData?.[1].total_btc_raised} Sats/B from{" "}
            {blockAggregationData?.[1].total_satsman_count} Satsmen
          </p>
        </div>
      </div>

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
                    item.highest_block_states[0]?.total_paid_sats ?? 0
                  ) / 1000}{" "}
                  K Sats
                </p>
                <p>{item.user_tunes.length} Satsman</p>
                <p>
                  paying{" "}
                  {item.highest_block_states[0]?.paid_sats_in_current_block ??
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
                      ?.total_deposit_btc_balances ?? 0
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
                  Received{" "}
                  {Number(
                    item.highest_block_states[0]?.total_paid_sats! ??
                      0
                  ) / 1000}{" "}
                  K Sats from {item.user_tunes.length} Satsman
                </p>
                <p>{pool_outcome_str(item.outcome)}</p>
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
