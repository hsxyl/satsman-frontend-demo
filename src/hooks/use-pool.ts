import { useQuery } from "@tanstack/react-query";
import { etchActor } from "../canister/etching/actor";
import { satsmanActor } from "canister/satsman/actor";
import { PageQuery } from "canister/satsman/service.did";

// export function useGames() {

//     return useQuery<GameAndPool[]>({
//         queryKey: ["games"],
//         queryFn: async () => {
//             const games = await cookieActor.get_games_info();
//             return games;
//         },
//         refetchInterval: 60 * 1000, // Refetch every 60 seconds
//     })

// }

// export function useGame( gameId: string) {

//     return useQuery<GameAndPool>({
//         queryKey: ["game", gameId],
//         queryFn: async () => {
//             const game = await cookieActor.get_game_info(gameId);
//             return game[0]!;
//         },
//         retry: false,
//         refetchInterval: 60 * 1000, // Refetch every 60 seconds
//     })
// }

export function usePoolBlockStates(pool_address: string | undefined) {
  return useQuery({
    queryKey: ["pool-block-states", pool_address],
    queryFn: async () => {
      if (!pool_address) {
        return undefined;
      }
      return await satsmanActor.get_launch_pool_block_states(pool_address);
    },
    enabled: !!pool_address,
    refetchInterval: 300 * 1000, // Refetch every 5 minutes
  });
}


export function useLaunchPools() {
  return useQuery({
    queryKey: ["launch-pools"],
    queryFn: async () => {
      return await satsmanActor.get_launch_pools();
    },
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  });
}

export function useUserRecords(address: string | undefined) {
  return useQuery({
    queryKey: ["user-launch-records", address],
    queryFn: async () => {
      if (!address) {
        return undefined;
      }
      return await satsmanActor.get_user_records(address);
    },
    enabled: !!address,
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  });

}


export function useHomePageBlockAggregationData(start_height: number | undefined, end_height: number | undefined) {
  return useQuery({
    queryKey: ["home_page_block_aggregation_data", start_height, end_height],
    queryFn: async () => {
      if (!start_height || !end_height) {
        return undefined;
      }
      return await satsmanActor.get_home_page_block_aggregation_data(start_height!, end_height!);
    },
    enabled: !!start_height && !!end_height,
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  });
}

export function useGetPoolWithStateAndKey(pool_address: string | undefined) {
  return useQuery({
    queryKey: ["get-pool-with-state-and-key", pool_address],
    queryFn: async () => {
      if (!pool_address) {
        return undefined;
      }
      return await satsmanActor.get_pool_with_state_and_key(pool_address);
    },
    enabled: !!pool_address,
    refetchInterval: 20 * 1000, // Refetch every 20 seconds
  });
}

export function useQueryLaunchPools(
  pageQuery: PageQuery
) {
  return useQuery({
    queryKey: ["launch-pools-with-page-query", JSON.stringify(pageQuery)],
    queryFn: async () => {
      return await satsmanActor.query_launch(pageQuery);
    },
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  });
}

export function useConfig() {
  return useQuery({
    queryKey: ["satsman-config"],
    queryFn: async () => {
      return await satsmanActor.get_config();
    },
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

export function useBlockStates(
  pool_address: string | undefined,
) {
  return useQuery({
    queryKey: ["block-states", pool_address],
    queryFn: async () => {
      if (!pool_address) {
        return undefined;
      }
      return await satsmanActor.get_launch_pool_block_states(pool_address);
    },
    enabled: !!pool_address,
    refetchInterval: 600 * 1000, // Refetch every 10 minutes
  });

}

export function useLaunchPool(pool_address: string | undefined) {
  return useQuery({
    queryKey: ["launch-pool", pool_address],
    queryFn: async () => {
      if (!pool_address) {
        return undefined;
      }
      return await satsmanActor.get_launch_pool(pool_address);
    },
    enabled: !!pool_address,
    refetchInterval: 60 * 1000, // Refetch every 10 seconds
  });
}

export function useEtchingRequest(commitTxid: string | undefined) {
  return useQuery({
    queryKey: ["etching-result", commitTxid],
    queryFn: async () => {
      if (!commitTxid) {
        return undefined;
      }
      const res = await etchActor.get_etching_request(commitTxid!);
      return res;
    },
    enabled: !!commitTxid,
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  });
}

export function useUserInfoOfLaunch(
    pool_address: string | undefined,
    user_address: string | undefined
) {
  return useQuery({
    queryKey: ["user-info-of-launch", pool_address, user_address],
    queryFn: async () => {
      return await satsmanActor.get_user_info_of_launch(pool_address!, user_address!);
    },
    enabled: !!pool_address && !!user_address,
    refetchInterval: 60 * 1000, // Refetch every 20 seconds
  });
}
