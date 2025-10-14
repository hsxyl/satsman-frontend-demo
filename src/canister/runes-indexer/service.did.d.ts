import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type BitcoinNetwork = { 'mainnet' : null } |
  { 'regtest' : null } |
  { 'testnet' : null };
export interface Config {
  'bitcoin_rpc_url' : string,
  'network' : BitcoinNetwork,
  'subscribers' : Array<Principal>,
}
export type Error = { 'MaxOutpointsExceeded' : null };
export interface EtchingAccountInfo {
  'derive_path' : string,
  'pubkey' : string,
  'address' : string,
}
export interface EtchingArgs {
  'terms' : [] | [OrdinalsTerms],
  'turbo' : boolean,
  'premine' : [] | [bigint],
  'logo' : [] | [LogoParams],
  'rune_name' : string,
  'divisibility' : [] | [number],
  'premine_receiver' : string,
  'symbol' : [] | [string],
}
export interface EtchingStateArgs {
  'ecdsa_key_name' : string,
  'etching_fee' : [] | [bigint],
  'btc_network' : BitcoinNetwork,
  'mpc_principal' : [] | [Principal],
}
export type EtchingStatus = { 'SendRevealSuccess' : null } |
  { 'SendRevealFailed' : null } |
  { 'SendCommitFailed' : null } |
  { 'SendCommitSuccess' : null } |
  { 'Final' : null } |
  { 'Initial' : null };
export type EtchingUpgradeArgs = { 'Upgrade' : [] | [EtchingStateArgs] } |
  { 'Init' : EtchingStateArgs };
export interface GetEtchingResult {
  'confirmations' : number,
  'rune_id' : string,
}
export interface LogoParams {
  'content_type' : string,
  'content_base64' : string,
}
export interface OrdinalsTerms {
  'cap' : bigint,
  'height' : [[] | [bigint], [] | [bigint]],
  'offset' : [[] | [bigint], [] | [bigint]],
  'amount' : bigint,
}
export type Result = { 'Ok' : string } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Array<[] | [Array<RuneBalance>]> } |
  { 'Err' : Error };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : string };
export interface RuneBalance {
  'confirmations' : number,
  'divisibility' : number,
  'amount' : bigint,
  'rune_id' : string,
  'symbol' : [] | [string],
}
export interface RuneEntry {
  'confirmations' : number,
  'mints' : bigint,
  'terms' : [] | [Terms],
  'etching' : string,
  'turbo' : boolean,
  'premine' : bigint,
  'divisibility' : number,
  'spaced_rune' : string,
  'number' : bigint,
  'timestamp' : bigint,
  'block' : bigint,
  'burned' : bigint,
  'rune_id' : string,
  'symbol' : [] | [string],
}
export type RunesIndexerArgs = { 'Upgrade' : [] | [UpgradeArgs] } |
  { 'Init' : Config };
export interface SendEtchingInfo {
  'status' : EtchingStatus,
  'script_out_address' : string,
  'err_info' : string,
  'commit_txid' : string,
  'time_at' : bigint,
  'etching_args' : EtchingArgs,
  'receiver' : string,
  'reveal_txid' : string,
}
export interface SetTxFeePerVbyteArgs {
  'low' : bigint,
  'high' : bigint,
  'medium' : bigint,
}
export interface Terms {
  'cap' : [] | [bigint],
  'height' : [[] | [bigint], [] | [bigint]],
  'offset' : [[] | [bigint], [] | [bigint]],
  'amount' : [] | [bigint],
}
export interface UpgradeArgs {
  'bitcoin_rpc_url' : [] | [string],
  'subscribers' : [] | [Array<Principal>],
}
export interface UtxoArgs { 'id' : string, 'index' : number, 'amount' : bigint }
export interface _SERVICE {
  'etching' : ActorMethod<[EtchingArgs], Result>,
  'etching_fee_utxos' : ActorMethod<[], Array<UtxoArgs>>,
  'etching_post_upgrade' : ActorMethod<[EtchingUpgradeArgs], undefined>,
  'get_etching' : ActorMethod<[string], [] | [GetEtchingResult]>,
  'get_etching_request' : ActorMethod<[string], [] | [SendEtchingInfo]>,
  'get_latest_block' : ActorMethod<[], [number, string]>,
  'get_rune' : ActorMethod<[string], [] | [RuneEntry]>,
  'get_rune_balances_for_outputs' : ActorMethod<[Array<string>], Result_1>,
  'get_rune_by_id' : ActorMethod<[string], [] | [RuneEntry]>,
  'init_etching_sender_account' : ActorMethod<[], EtchingAccountInfo>,
  'query_etching_fee' : ActorMethod<[], bigint>,
  'set_etching_fee_utxos' : ActorMethod<[Array<UtxoArgs>], undefined>,
  'set_tx_fee_per_vbyte' : ActorMethod<[SetTxFeePerVbyteArgs], Result_2>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
