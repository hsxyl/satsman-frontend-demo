import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { ICP_HOST } from "../../constants";
import { idlFactory, PoolStatus, _SERVICE as SatsmanService } from "./service.did";

export const SATSMAN_CANISTER_ID = "ord5m-xaaaa-aaaao-qkg5a-cai"
export const SATSMAN_EXCHANGE_ID = "satsman"


export const satsmanActor = Actor.createActor<SatsmanService>(idlFactory, {
  agent: HttpAgent.createSync({
    host: ICP_HOST,
  }),
  canisterId: SATSMAN_CANISTER_ID,
});

export function satsmanActorWithIdentity(
  identity: Identity
): ActorSubclass<SatsmanService>{
  return Actor.createActor<SatsmanService>(idlFactory, {
    agent: HttpAgent.createSync({
      host: ICP_HOST,
      identity
    }),
    canisterId: SATSMAN_CANISTER_ID,
  })
}

export type PoolStatusStr = "Upcoming"  | "Ongoing" | "LaunchFailed" | "LaunchSuccess" | "AddedLp"

export function pool_status_str(launch_status: PoolStatus): PoolStatusStr {
  let s = Object.entries(launch_status)[0]![0];
  if(["Upcoming" , "Ongoing" , "LaunchFailed" , "LaunchSuccess" ,"AddedLp"].includes(s)) {
    return s as PoolStatusStr;
  } else {
    throw new Error(`Invalid game status: ${s}`);
  }
}

export function pool_status_number(launch_status: PoolStatus): number {
  let s = Object.entries(launch_status)[0]![0];
  let status_vec = ["Upcoming" , "Ongoing" , "LaunchFailed" , "LaunchSuccess" , "AddedLp"];
  let idx = status_vec.indexOf(s);
  if(idx >= 0) {
    return idx;
  } else {
    throw new Error(`Invalid game status: ${s}`);
  }
}
