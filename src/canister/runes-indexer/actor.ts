import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { ICP_HOST } from "../../constants";
import { idlFactory, _SERVICE as IndexerService } from "./service.did";

export const INDEXER_CANISTER_ID = "f2dwm-caaaa-aaaao-qjxlq-cai"


export const indexerActor = Actor.createActor<IndexerService>(idlFactory, {
  agent: HttpAgent.createSync({
    host: ICP_HOST,
  }),
  canisterId: INDEXER_CANISTER_ID,
});