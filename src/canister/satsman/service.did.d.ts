import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'withdraw_txid' : [] | [string],
  'total_contributed_btc' : bigint,
  'btc_balance' : bigint,
  'referral_reward' : bigint,
  'withdrawn' : boolean,
  'used_btc_balance' : bigint,
  'minted_rune_amount' : bigint,
}
export interface BlockState {
  'total_minted_rune' : bigint,
  'user_accounts' : Array<[string, Account]>,
  'block_height' : number,
  'total_raised_btc_balances' : bigint,
}
export interface CoinBalance { 'id' : string, 'value' : bigint }
export interface CreateLaunchState {
  'key' : string,
  'create_pool_fee' : bigint,
  'txid' : string,
  'utxo' : Utxo,
  'register_pool_address' : string,
  'nonce' : bigint,
  'min_start_block_height' : number,
}
export type Event = {
    'Withdraw' : {
      'user' : string,
      'btc_amount' : bigint,
      'rune_amount' : bigint,
      'pool_address' : string,
    }
  } |
  { 'CreatePool' : GetPoolInfoArgs } |
  {
    'TopUp' : { 'user' : string, 'amount' : bigint, 'pool_address' : string }
  } |
  {
    'AddLp' : {
      'btc_amount' : bigint,
      'rune_amount' : bigint,
      'pool_address' : string,
    }
  };
export type ExchangeError = { 'InvalidArgs' : string } |
  { 'PoolBusinessStateNotFound' : string } |
  { 'ExchangeStateNotInitialized' : null } |
  { 'CustomError' : string };
export interface ExchangeState {
  'rune_premine_amount' : bigint,
  'raising_target_max' : bigint,
  'raising_target_min' : bigint,
  'minimum_top_up_sats' : bigint,
  'active_launch_pool_address_set' : Array<string>,
  'uuid' : bigint,
  'launch_duration_blocks' : number,
  'register_pool_address' : [] | [string],
  'rune_divisibility' : number,
  'user_referral_codes' : Array<[string, string]>,
  'launch_rune_reverse_for_lp_percent' : number,
  'is_task_running' : boolean,
  'launch_rune_percent' : number,
  'create_fee_sats' : bigint,
  'launch_raised_btc_share' : LaunchRaisedBtcShare,
  'code_of_users' : Array<[string, string]>,
}
export interface ExecuteTxArgs {
  'zero_confirmed_tx_queue_length' : number,
  'txid' : string,
  'intention_set' : IntentionSet,
  'intention_index' : number,
  'psbt_hex' : string,
}
export interface GetPoolInfoArgs { 'pool_address' : string }
export interface InputCoin { 'coin' : CoinBalance, 'from' : string }
export interface Intention {
  'input_coins' : Array<InputCoin>,
  'output_coins' : Array<OutputCoin>,
  'action' : string,
  'exchange_id' : string,
  'pool_utxo_spent' : Array<string>,
  'action_params' : string,
  'nonce' : bigint,
  'pool_address' : string,
  'pool_utxo_received' : Array<Utxo>,
}
export interface IntentionSet {
  'tx_fee_in_sats' : bigint,
  'initiator_address' : string,
  'intentions' : Array<Intention>,
}
export interface LaunchArgs {
  'start_height' : number,
  'social_info' : SocialInfo,
  'banner' : [] | [string],
  'description' : [] | [string],
  'raising_target_sats' : bigint,
}
export interface LaunchRaisedBtcShare {
  'referral_bonus_per_mille' : number,
  'exchange_fee_per_mille' : number,
  'lp_per_mille' : number,
}
export interface LaunchRuneEtchingArgs {
  'rune_logo' : [] | [LogoParams],
  'rune_name' : string,
  'rune_symbol' : [] | [string],
}
export interface LaunchpadState {
  'txid' : string,
  'utxo' : Utxo,
  'event' : Event,
  'nonce' : bigint,
}
export interface LogoParams {
  'content_type' : string,
  'content_base64' : string,
}
export interface NewBlockInfo {
  'block_hash' : string,
  'confirmed_txids' : Array<string>,
  'block_timestamp' : bigint,
  'block_height' : number,
}
export interface OutputCoin { 'to' : string, 'coin' : CoinBalance }
export interface PoolBasic { 'name' : string, 'address' : string }
export interface PoolBusinessStateView {
  'status' : PoolStatus,
  'creator' : string,
  'start_height' : number,
  'launch_rune_etching_args' : LaunchRuneEtchingArgs,
  'reveal_tx' : [] | [string],
  'end_height' : number,
  'pubkey' : string,
  'btc_amount_for_lp' : bigint,
  'raising_target' : bigint,
  'rune_premine' : [] | [bigint],
  'key_path' : string,
  'highest_block_states' : [] | [BlockState],
  'rune_amount_for_lp' : [] | [bigint],
  'launch_args' : LaunchArgs,
  'rune_amount_for_launch' : [] | [bigint],
  'pool_address' : string,
  'launch_raised_btc_share' : LaunchRaisedBtcShare,
  'add_lp_txid' : [] | [string],
  'rune_id' : [] | [string],
  'etch_commit_tx' : [] | [string],
}
export interface PoolInfo {
  'key' : string,
  'name' : string,
  'btc_reserved' : bigint,
  'key_derivation_path' : Array<Uint8Array | number[]>,
  'coin_reserved' : Array<CoinBalance>,
  'attributes' : string,
  'address' : string,
  'nonce' : bigint,
  'utxos' : Array<Utxo>,
}
export type PoolStatus = { 'Init' : null } |
  { 'InitUtxoFinalized' : null } |
  { 'AddedLp' : null } |
  { 'LaunchSuccess' : null } |
  { 'AddingLp' : null } |
  { 'EtchFailed' : string } |
  { 'Processing' : null } |
  { 'Etching' : null } |
  { 'LaunchFailed' : null };
export type Result = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : string } |
  { 'Err' : ExchangeError };
export type Result_2 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : null } |
  { 'Err' : ExchangeError };
export interface RollbackTxArgs { 'txid' : string, 'reason_code' : string }
export interface SocialInfo {
  'twitter' : [] | [string],
  'website' : [] | [string],
  'discord' : [] | [string],
  'telegram' : [] | [string],
  'github' : [] | [string],
}
export interface UserInfoOfLaunch {
  'tune' : number,
  'account' : [] | [Account],
  'launch_pool_address' : string,
  'referred_by_code' : [] | [string],
  'my_referral_code' : [] | [string],
}
export interface Utxo {
  'coins' : Array<CoinBalance>,
  'sats' : bigint,
  'txid' : string,
  'vout' : number,
}
export interface _SERVICE {
  'check_rune_name_available' : ActorMethod<[string], Result>,
  'etching_for_launch' : ActorMethod<[string, LaunchRuneEtchingArgs], Result_1>,
  'execute_tx' : ActorMethod<[ExecuteTxArgs], Result_2>,
  'generate_referral_code' : ActorMethod<[string], string>,
  'get_block_state' : ActorMethod<[string], Array<BlockState>>,
  'get_create_launch_info' : ActorMethod<[], CreateLaunchState>,
  'get_exchange_state' : ActorMethod<[], ExchangeState>,
  'get_launch_pool' : ActorMethod<[string], [] | [PoolBusinessStateView]>,
  'get_launch_pools' : ActorMethod<[], Array<PoolBusinessStateView>>,
  'get_pool_info' : ActorMethod<[GetPoolInfoArgs], [] | [PoolInfo]>,
  'get_pool_list' : ActorMethod<[], Array<PoolBasic>>,
  'get_pool_with_state_and_key' : ActorMethod<
    [string],
    [] | [[LaunchpadState, string]]
  >,
  'get_register_pool_address' : ActorMethod<[], string>,
  'get_user_info_of_launch' : ActorMethod<[string, string], UserInfoOfLaunch>,
  'init_register_pool' : ActorMethod<[string, number, bigint], string>,
  'new_block' : ActorMethod<[NewBlockInfo], Result_3>,
  'query_tx_event' : ActorMethod<[string], [] | [Event]>,
  'reset_blocks' : ActorMethod<[], Result_3>,
  'rollback_tx' : ActorMethod<[RollbackTxArgs], Result_3>,
  'set_user_referral_code' : ActorMethod<[string, string, string], Result_4>,
  'tmp_reset_to_etched' : ActorMethod<[string], undefined>,
  'tune' : ActorMethod<[string, string, number], Result_4>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
