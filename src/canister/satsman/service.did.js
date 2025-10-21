export const idlFactory = ({ IDL }) => {
  const CoinBalance = IDL.Record({ 'id' : IDL.Text, 'value' : IDL.Nat });
  const InputCoin = IDL.Record({ 'coin' : CoinBalance, 'from' : IDL.Text });
  const OutputCoin = IDL.Record({ 'to' : IDL.Text, 'coin' : CoinBalance });
  const Utxo = IDL.Record({
    'coins' : IDL.Vec(CoinBalance),
    'sats' : IDL.Nat64,
    'txid' : IDL.Text,
    'vout' : IDL.Nat32,
  });
  const Intention = IDL.Record({
    'input_coins' : IDL.Vec(InputCoin),
    'output_coins' : IDL.Vec(OutputCoin),
    'action' : IDL.Text,
    'exchange_id' : IDL.Text,
    'pool_utxo_spent' : IDL.Vec(IDL.Text),
    'action_params' : IDL.Text,
    'nonce' : IDL.Nat64,
    'pool_address' : IDL.Text,
    'pool_utxo_received' : IDL.Vec(Utxo),
  });
  const IntentionSet = IDL.Record({
    'tx_fee_in_sats' : IDL.Nat64,
    'initiator_address' : IDL.Text,
    'intentions' : IDL.Vec(Intention),
  });
  const ExecuteTxArgs = IDL.Record({
    'zero_confirmed_tx_queue_length' : IDL.Nat32,
    'txid' : IDL.Text,
    'intention_set' : IntentionSet,
    'intention_index' : IDL.Nat32,
    'psbt_hex' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Account = IDL.Record({
    'withdraw_txid' : IDL.Opt(IDL.Text),
    'receive_rune_in_current_block' : IDL.Nat,
    'last_update_block' : IDL.Nat32,
    'total_contributed_btc' : IDL.Nat64,
    'pay_in_current_block' : IDL.Nat64,
    'btc_balance' : IDL.Nat64,
    'referral_reward' : IDL.Float64,
    'address' : IDL.Text,
    'withdrawn' : IDL.Bool,
    'used_btc_balance' : IDL.Nat64,
    'minted_rune_amount' : IDL.Nat,
    'referral_reward_in_current_block' : IDL.Float64,
  });
  const BlockState = IDL.Record({
    'paying_sats_in_current_block' : IDL.Nat64,
    'price_in_current_block' : IDL.Float64,
    'total_minted_rune' : IDL.Nat,
    'user_total_balance_in_current_block' : IDL.Nat64,
    'user_accounts' : IDL.Vec(IDL.Tuple(IDL.Text, Account)),
    'block_height' : IDL.Nat32,
    'total_raised_btc_balances' : IDL.Nat64,
  });
  const CreateLaunchState = IDL.Record({
    'create_pool_fee' : IDL.Nat64,
    'min_start_block_height' : IDL.Nat32,
  });
  const ExchangeState = IDL.Record({
    'active_launch_pool_address_set' : IDL.Vec(IDL.Text),
    'uuid' : IDL.Nat64,
    'user_referral_codes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'is_task_running' : IDL.Bool,
    'code_of_users' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const PoolStatus = IDL.Variant({
    'Init' : IDL.Null,
    'AddedLp' : IDL.Null,
    'Ongoing' : IDL.Null,
    'LaunchSuccess' : IDL.Null,
    'AddingLp' : IDL.Null,
    'Upcoming' : IDL.Null,
    'LaunchFailed' : IDL.Null,
  });
  const SocialInfo = IDL.Record({
    'twitter' : IDL.Opt(IDL.Text),
    'website' : IDL.Opt(IDL.Text),
    'discord' : IDL.Opt(IDL.Text),
    'telegram' : IDL.Opt(IDL.Text),
    'github' : IDL.Opt(IDL.Text),
  });
  const IncomeDistributionItem = IDL.Record({
    'label' : IDL.Text,
    'address' : IDL.Text,
    'percentage' : IDL.Nat8,
  });
  const LaunchPlan = IDL.Record({
    'start_height' : IDL.Nat32,
    'social_info' : SocialInfo,
    'token_for_lp' : IDL.Text,
    'rune_name' : IDL.Text,
    'banner' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'span_blocks' : IDL.Nat32,
    'raising_target_sats' : IDL.Nat64,
    'token_for_auction' : IDL.Text,
    'rune_id' : IDL.Text,
    'income_distribution' : IDL.Vec(IncomeDistributionItem),
  });
  const LaunchRaisedBtcShare = IDL.Record({
    'creator_distribution_percentage' : IDL.Nat8,
    'exchange_fee_percentage' : IDL.Nat8,
    'referral_bonus_percentage' : IDL.Nat8,
    'lp_percentage' : IDL.Nat8,
  });
  const PoolBusinessStateView = IDL.Record({
    'status' : PoolStatus,
    'creator' : IDL.Text,
    'featured' : IDL.Bool,
    'start_height' : IDL.Nat32,
    'end_height' : IDL.Nat32,
    'pubkey' : IDL.Text,
    'btc_amount_for_lp' : IDL.Nat,
    'raising_target' : IDL.Nat64,
    'key_derivation_path' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'highest_block_states' : IDL.Opt(BlockState),
    'user_tunes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat8)),
    'rune_amount_for_lp' : IDL.Nat,
    'rune_amount_for_launch' : IDL.Nat,
    'pool_address' : IDL.Text,
    'launch_plan' : LaunchPlan,
    'launch_raised_btc_share' : LaunchRaisedBtcShare,
    'add_lp_txid' : IDL.Opt(IDL.Text),
    'rune_id' : IDL.Text,
  });
  const GetPoolInfoArgs = IDL.Record({ 'pool_address' : IDL.Text });
  const PoolInfo = IDL.Record({
    'key' : IDL.Text,
    'name' : IDL.Text,
    'btc_reserved' : IDL.Nat64,
    'key_derivation_path' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'coin_reserved' : IDL.Vec(CoinBalance),
    'attributes' : IDL.Text,
    'address' : IDL.Text,
    'nonce' : IDL.Nat64,
    'utxos' : IDL.Vec(Utxo),
  });
  const PoolBasic = IDL.Record({ 'name' : IDL.Text, 'address' : IDL.Text });
  const Event = IDL.Variant({
    'Withdraw' : IDL.Record({
      'user' : IDL.Text,
      'btc_amount' : IDL.Nat64,
      'rune_amount' : IDL.Nat,
      'pool_address' : IDL.Text,
    }),
    'CreatePool' : GetPoolInfoArgs,
    'WithdrawRune' : IDL.Record({
      'user' : IDL.Text,
      'rune_amount' : IDL.Nat,
      'pool_address' : IDL.Text,
    }),
    'TopUp' : IDL.Record({
      'user' : IDL.Text,
      'amount' : IDL.Nat64,
      'pool_address' : IDL.Text,
    }),
    'AddLp' : IDL.Record({
      'btc_amount' : IDL.Nat64,
      'rune_amount' : IDL.Nat,
      'pool_address' : IDL.Text,
    }),
  });
  const LaunchpadState = IDL.Record({
    'user_balances' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64)),
    'withdrawn_rune' : IDL.Bool,
    'txid' : IDL.Text,
    'utxo' : Utxo,
    'event' : Event,
    'nonce' : IDL.Nat64,
    'withdrawn_user_set' : IDL.Vec(IDL.Text),
  });
  const UserInfoOfLaunch = IDL.Record({
    'tune' : IDL.Nat8,
    'account' : IDL.Opt(Account),
    'launch_pool_address' : IDL.Text,
    'referred_by_code' : IDL.Opt(IDL.Text),
    'my_referral_code' : IDL.Opt(IDL.Text),
  });
  const UserLaunchRecordPools = IDL.Record({
    'user_referral_pools' : IDL.Vec(PoolBusinessStateView),
    'user_created_pools' : IDL.Vec(PoolBusinessStateView),
    'user_joined_pools' : IDL.Vec(PoolBusinessStateView),
  });
  const NewBlockInfo = IDL.Record({
    'block_hash' : IDL.Text,
    'confirmed_txids' : IDL.Vec(IDL.Text),
    'block_timestamp' : IDL.Nat64,
    'block_height' : IDL.Nat32,
  });
  const Page = IDL.Record({
    'page_size' : IDL.Nat32,
    'total' : IDL.Nat32,
    'page' : IDL.Nat32,
    'total_pages' : IDL.Nat32,
    'items' : IDL.Vec(PoolBusinessStateView),
    'has_next' : IDL.Bool,
    'has_prev' : IDL.Bool,
  });
  const SortBy = IDL.Variant({
    'TVL' : IDL.Null,
    'StartHeight' : IDL.Null,
    'UserCount' : IDL.Null,
    'EndHeight' : IDL.Null,
  });
  const Filter = IDL.Variant({
    'Ongoing' : IDL.Null,
    'Completed' : IDL.Null,
    'Upcoming' : IDL.Null,
  });
  const SortOrder = IDL.Variant({ 'Asc' : IDL.Null, 'Desc' : IDL.Null });
  const PageQuery = IDL.Record({
    'sort_by' : IDL.Opt(SortBy),
    'page_size' : IDL.Nat32,
    'status_filters' : IDL.Opt(Filter),
    'page' : IDL.Nat32,
    'sort_order' : IDL.Opt(SortOrder),
    'search_text' : IDL.Opt(IDL.Text),
  });
  const RollbackTxArgs = IDL.Record({
    'txid' : IDL.Text,
    'reason_code' : IDL.Text,
  });
  const ExchangeError = IDL.Variant({
    'InvalidPageQuery' : IDL.Text,
    'InvalidRuneName' : IDL.Tuple(IDL.Text, IDL.Text),
    'InvalidArgs' : IDL.Text,
    'PoolBusinessStateNotFound' : IDL.Text,
    'RuneNameExist' : IDL.Text,
    'InvalidLaunchPlan' : IDL.Text,
    'ExchangeStateNotInitialized' : IDL.Null,
    'CustomError' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ExchangeError });
  return IDL.Service({
    'execute_tx' : IDL.Func([ExecuteTxArgs], [Result], []),
    'feature_pool' : IDL.Func([IDL.Text], [Result_1], []),
    'generate_referral_code' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_block_state' : IDL.Func([IDL.Text], [IDL.Vec(BlockState)], ['query']),
    'get_create_launch_info' : IDL.Func([], [CreateLaunchState], ['query']),
    'get_exchange_state' : IDL.Func([], [ExchangeState], ['query']),
    'get_launch_pool' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(PoolBusinessStateView)],
        ['query'],
      ),
    'get_launch_pool_block_states' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(BlockState)],
        ['query'],
      ),
    'get_launch_pools' : IDL.Func(
        [],
        [IDL.Vec(PoolBusinessStateView)],
        ['query'],
      ),
    'get_pool_info' : IDL.Func(
        [GetPoolInfoArgs],
        [IDL.Opt(PoolInfo)],
        ['query'],
      ),
    'get_pool_list' : IDL.Func([], [IDL.Vec(PoolBasic)], ['query']),
    'get_pool_with_state_and_key' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Tuple(LaunchpadState, IDL.Text))],
        ['query'],
      ),
    'get_user_info_of_launch' : IDL.Func(
        [IDL.Text, IDL.Text],
        [UserInfoOfLaunch],
        ['query'],
      ),
    'get_user_records' : IDL.Func([IDL.Text], [UserLaunchRecordPools], []),
    'new_block' : IDL.Func([NewBlockInfo], [Result_1], []),
    'new_pool' : IDL.Func([IDL.Text], [IDL.Text], []),
    'query_end_launch' : IDL.Func([IDL.Nat32, IDL.Nat32], [Page], ['query']),
    'query_launch' : IDL.Func([PageQuery], [Page], []),
    'query_tx_event' : IDL.Func([IDL.Text], [IDL.Opt(Event)], ['query']),
    'reset_blocks' : IDL.Func([], [Result_1], []),
    'rollback_tx' : IDL.Func([RollbackTxArgs], [Result_1], []),
    'set_user_referral_code' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_2],
        [],
      ),
    'test_restore_test_pool' : IDL.Func([], [], []),
    'tmp_reset_to_etched' : IDL.Func([IDL.Text], [], []),
    'tune' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat8], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
