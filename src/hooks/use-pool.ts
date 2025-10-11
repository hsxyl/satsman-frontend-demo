import { useQuery } from "@tanstack/react-query";
import { etchActor } from "../canister/etching/actor";
import { satsmanActor } from "canister/satsman/actor";

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

export function useLaunchPools() {
  return useQuery({
    queryKey: ["launch-pools"],
    queryFn: async () => {
      return await satsmanActor.get_launch_pools();
    },
    refetchInterval: 60 * 1000, // Refetch every 20 seconds
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
