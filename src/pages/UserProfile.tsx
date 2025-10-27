import { useLaserEyes } from "@omnisat/lasereyes";
import { Table } from "antd";
import { pool_status_str } from "canister/satsman/actor";
import { useUserRecords } from "hooks/use-pool";

export function UserProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const user_address =
    urlParams.get("user_address") ||
    window.location.pathname.split("/profile/")[1];

  const { data: userRecords , isLoading} = useUserRecords(user_address);

  const columns = [
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
    },
    {
      title: "TVL/Satsman",
      dataIndex: "tvl_satsman",
      key: "tvl_satsman",
    },
    {
      title: "Outcome",
      dataIndex: "outcome",
      key: "outcome",
    },
  ];

  const satsmanColumns = [
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "TVL/Satsmen",
      dataIndex: "tvl_satsmen",
      key: "tvl_satsmen",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Satsman",
      dataIndex: "satsman",
      key: "satsman",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-[#f0f2f5] m-2 p-2">
      <p>{user_address}</p>
      <h1>Launch Records</h1>
      <div className="border-t-2 border-black-300 border-dashed m-4 w-1/2"></div>
      <Table
      loading={isLoading}
        columns={columns}
        dataSource={
          userRecords?.user_created_pools.map((record) => ({
            token: (
              <div>
                {record.launch_plan.rune_name}{" "}
                {record.featured && <span style={{ color: "gold" }}>★</span>}
              </div>
            ),
            duration: `${record.start_height} - ${record.end_height}`,
            target: `${(Number(record.launch_plan.raising_target_sats) / 1000).toFixed(2)} K Sats`,
            tvl_satsman: `${(Number(record.highest_block_states[0]?.total_auction_raised_amount) / 1000000).toFixed(4)} M S / ${record.user_tunes.length}`,
            outcome: pool_status_str(record.status),
          })) || []
        }
      />
      <h1 className="mt-8">As Satsman</h1>
      <div className="border-t-2 border-black-300 border-dashed m-4 w-1/2"></div>
      <Table
      loading={isLoading}
        columns={satsmanColumns}
        dataSource={
          userRecords?.user_joined_pools.map((record) => ({
            token: (
              <div>
                {record.launch_plan.rune_name}{" "}
                {record.featured && <span style={{ color: "gold" }}>★</span>}
              </div>
            ),
            duration: `${record.start_height} - ${record.end_height}`,
            tvl_satsmen: `${(Number(record.highest_block_states[0]?.total_auction_raised_amount) / 1000000).toFixed(4)} M S / ${record.user_tunes.length}`,
            status: pool_status_str(record.status),
            satsman: `${record.user_tunes.length}`,
          })) || []
        }
       />
    </div>
  );
}
