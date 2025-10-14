import { useQuery } from "@tanstack/react-query";
import { getBtcLatestHeight } from "api/mempool";

export function useLatestBlockHeight() {
  return useQuery({
    queryKey: ["btc-latest-block-height"],
    queryFn: async () => {
        return await getBtcLatestHeight()
    },
    refetchInterval: 10 * 1000, // Refetch every 60 seconds
  });
}