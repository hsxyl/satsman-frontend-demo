import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'withdraw_txid' : [] | [string],
  'receive_rune_in_current_block' : bigint,
  'last_update_block' : number,
  'tune' : number,
  'total_contributed_btc' : bigint,
  'pay_in_current_block' : bigint,
  'btc_balance' : bigint,
  'referral_reward' : number,
  'address' : string,
  'withdrawn' : boolean,
  'used_btc_balance' : bigint,
  'minted_rune_amount' : bigint,
  'referral_reward_in_current_block' : number,
}
export interface BlockAggregateData {
  'total_paying_sats' : bigint,
  'total_minted_rune' : bigint,
  'total_ongoing_launch_pools' : number,
  'total_paying_users' : number,
}
export interface BlockState {
  'paying_sats_in_current_block' : bigint,
  'price_in_current_block' : number,
  'total_minted_rune' : bigint,
  'user_total_balance_in_current_block' : bigint,
  'user_accounts' : Array<[string, Account]>,
  'block_height' : number,
  'total_raised_btc_balances' : bigint,
}
export interface CoinBalance { 'id' : string, 'value' : bigint }
export interface Config {
  'maximum_raising_target' : bigint,
  'minimum_top_up_sats' : bigint,
  'maximum_start_height_offset' : number,
  'exchange_fee_percentage' : number,
  'finalize_threshold' : number,
  'launch_span_options' : Uint32Array | number[],
  'referral_bonus_percentage' : number,
  'minimum_auction_income_for_lp_percentage' : number,
  'minimum_raising_target' : bigint,
  'maximum_top_up_sats' : bigint,
  'create_fee_sats' : bigint,
  'minimum_start_height_offset' : number,
}
export interface CreateLaunchState {
  'create_pool_fee' : bigint,
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
    'WithdrawRune' : {
      'user' : string,
      'rune_amount' : bigint,
      'pool_address' : string,
    }
  } |
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
export type ExchangeError = { 'InvalidPageQuery' : string } |
  { 'InvalidRuneName' : [string, string] } |
  { 'InvalidArgs' : string } |
  { 'PoolBusinessStateNotFound' : string } |
  { 'RuneNameExist' : string } |
  { 'InvalidLaunchPlan' : string } |
  { 'ExchangeStateNotInitialized' : null } |
  { 'CustomError' : string };
export interface ExchangeState {
  'active_launch_pool_address_set' : Array<string>,
  'uuid' : bigint,
  'user_referral_codes' : Array<[string, string]>,
  'is_task_running' : boolean,
  'code_of_users' : Array<[string, string]>,
  'sync_block_height' : number,
}
export interface ExecuteTxArgs {
  'zero_confirmed_tx_queue_length' : number,
  'txid' : string,
  'intention_set' : IntentionSet,
  'intention_index' : number,
  'psbt_hex' : string,
}
export type Filter = { 'Ongoing' : null } |
  { 'Completed' : null } |
  { 'Upcoming' : null };
export interface GetPoolInfoArgs { 'pool_address' : string }
export interface HomePageBlockData {
  'ongoing_launches_count' : number,
  'total_release_rune_amount' : bigint,
}
export interface HomePageSatsmanData {
  'total_btc_raised' : bigint,
  'total_satsman_count' : number,
}
export interface IncomeDistributionItem {
  'label' : string,
  'address' : string,
  'percentage' : number,
}
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
export interface LaunchPlan {
  'start_height' : number,
  'income_for_lp_percentage' : number,
  'is_meme_template' : boolean,
  'social_info' : SocialInfo,
  'token_for_lp' : string,
  'rune_name' : string,
  'banner' : [] | [string],
  'description' : [] | [string],
  'span_blocks' : number,
  'raising_target_sats' : bigint,
  'token_for_auction' : string,
  'rune_id' : string,
  'income_distribution' : Array<IncomeDistributionItem>,
}
export interface LaunchpadState {
  'user_balances' : Array<[string, bigint]>,
  'withdrawn_rune' : boolean,
  'txid' : string,
  'utxo' : Utxo,
  'event' : Event,
  'nonce' : bigint,
  'withdrawn_user_set' : Array<string>,
}
export interface NewBlockInfo {
  'block_hash' : string,
  'confirmed_txids' : Array<string>,
  'block_timestamp' : bigint,
  'block_height' : number,
}
export interface OutputCoin { 'to' : string, 'coin' : CoinBalance }
export interface Page {
  'page_size' : number,
  'total' : number,
  'page' : number,
  'total_pages' : number,
  'items' : Array<PoolBusinessStateView>,
  'has_next' : boolean,
  'has_prev' : boolean,
}
export interface PageQuery {
  'sort_by' : [] | [SortBy],
  'featured_first' : boolean,
  'page_size' : number,
  'status_filters' : [] | [Filter],
  'page' : number,
  'sort_order' : [] | [SortOrder],
  'search_text' : [] | [string],
}
export interface PoolBasic { 'name' : string, 'address' : string }
export interface PoolBusinessStateView {
  'status' : PoolStatus,
  'creator' : string,
  'featured' : boolean,
  'start_height' : number,
  'end_height' : number,
  'pubkey' : string,
  'btc_amount_for_lp' : bigint,
  'raising_target' : bigint,
  'key_derivation_path' : Array<Uint8Array | number[]>,
  'exchange_fee_percentage' : number,
  'referral_bonus_percentage' : number,
  'highest_block_states' : [] | [BlockState],
  'user_tunes' : Array<[string, number]>,
  'rune_amount_for_lp' : bigint,
  'rune_amount_for_launch' : bigint,
  'pool_address' : string,
  'launch_plan' : LaunchPlan,
  'add_lp_txid' : [] | [string],
  'rune_id' : string,
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
export type PoolStatus = { 'AddedLp' : null } |
  { 'Ongoing' : null } |
  { 'LaunchSuccess' : null } |
  { 'AddingLp' : null } |
  { 'Upcoming' : null } |
  { 'LaunchFailed' : null };
export type Result = { 'Ok' : string } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : ExchangeError };
export interface RollbackTxArgs { 'txid' : string, 'reason_code' : string }
export interface SocialInfo {
  'twitter' : [] | [string],
  'website' : [] | [string],
  'discord' : [] | [string],
  'telegram' : [] | [string],
  'github' : [] | [string],
}
export type SortBy = { 'TVL' : null } |
  { 'StartHeight' : null } |
  { 'UserCount' : null } |
  { 'EndHeight' : null };
export type SortOrder = { 'Asc' : null } |
  { 'Desc' : null };
export interface UserInfoOfLaunch {
  'tune' : number,
  'account' : [] | [Account],
  'launch_pool_address' : string,
  'referred_by_code' : [] | [string],
  'my_referral_code' : [] | [string],
}
export interface UserLaunchRecordPools {
  'user_referral_pools' : Array<PoolBusinessStateView>,
  'user_created_pools' : Array<PoolBusinessStateView>,
  'user_joined_pools' : Array<PoolBusinessStateView>,
}
export interface Utxo {
  'coins' : Array<CoinBalance>,
  'sats' : bigint,
  'txid' : string,
  'vout' : number,
}
export interface _SERVICE {
  'execute_tx' : ActorMethod<[ExecuteTxArgs], Result>,
  'feature_pool' : ActorMethod<[string], Result_1>,
  'generate_referral_code' : ActorMethod<[string], string>,
  'get_block_state' : ActorMethod<[string], Array<BlockState>>,
  'get_config' : ActorMethod<[], Config>,
  'get_create_launch_info' : ActorMethod<[], CreateLaunchState>,
  'get_exchange_state' : ActorMethod<[], ExchangeState>,
  'get_home_page_block_aggregation_data' : ActorMethod<
    [number, number],
    [Array<[number, HomePageBlockData]>, HomePageSatsmanData]
  >,
  'get_launch_pool' : ActorMethod<[string], [] | [PoolBusinessStateView]>,
  'get_launch_pool_block_states' : ActorMethod<[string], Array<BlockState>>,
  'get_launch_pools' : ActorMethod<[], Array<PoolBusinessStateView>>,
  'get_pool_info' : ActorMethod<[GetPoolInfoArgs], [] | [PoolInfo]>,
  'get_pool_list' : ActorMethod<[], Array<PoolBasic>>,
  'get_pool_with_state_and_key' : ActorMethod<
    [string],
    [] | [[LaunchpadState, string]]
  >,
  'get_user_info_of_launch' : ActorMethod<[string, string], UserInfoOfLaunch>,
  'get_user_records' : ActorMethod<[string], UserLaunchRecordPools>,
  'new_block' : ActorMethod<[NewBlockInfo], Result_1>,
  'new_pool' : ActorMethod<[string], string>,
  'query_block_index_data' : ActorMethod<
    [number, number],
    Array<[number, BlockAggregateData]>
  >,
  'query_launch' : ActorMethod<[PageQuery], Page>,
  'query_tx_event' : ActorMethod<[string], [] | [Event]>,
  'reset_blocks' : ActorMethod<[], Result_1>,
  'rollback_tx' : ActorMethod<[RollbackTxArgs], Result_1>,
  'set_user_referral_code' : ActorMethod<[string, string, string], Result_2>,
  'test_restore_test_pool' : ActorMethod<[], undefined>,
  'tmp_reset_to_etched' : ActorMethod<[string], undefined>,
  'tune' : ActorMethod<[string, string, number], Result_2>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
