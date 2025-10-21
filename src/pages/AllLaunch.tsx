import { SearchOutlined, StarFilled } from "@ant-design/icons";
import { Divider, Input, Table } from "antd";
import { pool_status_str } from "canister/satsman/actor";
import { useQueryLaunchPools } from "hooks/use-pool";
import { title } from "process";
import { data } from "react-router-dom";

export function AllLaunch() {
  const { data } = useQueryLaunchPools({
    page: 1,
    page_size: 100,
    sort_by: [
      {
        StartHeight: null,
      },
    ],
    sort_order: [],
    status_filters: [],
    search_text: [],
  });

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
      title: "TVL",
      dataIndex: "tvl",
      key: "tvl",
    },
    {
      title: "Satsman",
      dataIndex: "satsman",
      key: "satsman",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center bg-[#f0f2f5]">
      <div className="p-2 flex flex-row items-center justify-around w-full">
        <h1>All Launches</h1>
        <div className="flex items-center">
          <input
            placeholder="Search"
            className="border border-gray-300 rounded-md p-2"
          />
          <SearchOutlined className="ml-2" />
        </div>
      </div>
      <div className="border-t border-black-300 w-full m-4" />
      <Table
        columns={columns}
          dataSource={
            data?.items.map((pool) => ({
              token: <div>{pool.launch_plan.rune_name} {pool.featured && <StarFilled style={{ color: "gold" }} />}</div>,
              duration: `${pool.start_height} - ${pool.end_height}`,
              tvl: `${(Number(pool.highest_block_states[0]!.total_raised_btc_balances) / 1000000).toFixed(4)} M S`,
              satsman: `${(Number(pool.user_tunes.length))}`,
              status: pool_status_str(pool.status),
            })) || []
          }
      />
    </div>
  );
}
