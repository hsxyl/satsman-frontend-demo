export const idlFactory = ({ IDL }) => {
  const LaunchRaisedBtcShare = IDL.Record({
    'referral_bonus_per_mille' : IDL.Nat16,
    'exchange_fee_per_mille' : IDL.Nat16,
    'lp_per_mille' : IDL.Nat16,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const ExchangeError = IDL.Variant({
    'InvalidRuneName' : IDL.Tuple(IDL.Text, IDL.Text),
    'InvalidArgs' : IDL.Text,
    'PoolBusinessStateNotFound' : IDL.Text,
    'RuneNameExist' : IDL.Text,
    'ExchangeStateNotInitialized' : IDL.Null,
    'CustomError' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ExchangeError });
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
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const Account = IDL.Record({
    'withdraw_txid' : IDL.Opt(IDL.Text),
    'total_contributed_btc' : IDL.Nat64,
    'btc_balance' : IDL.Nat64,
    'referral_reward' : IDL.Nat64,
    'withdrawn' : IDL.Bool,
    'used_btc_balance' : IDL.Nat64,
    'minted_rune_amount' : IDL.Nat,
  });
  const BlockState = IDL.Record({
    'total_minted_rune' : IDL.Nat,
    'user_accounts' : IDL.Vec(IDL.Tuple(IDL.Text, Account)),
    'block_height' : IDL.Nat32,
    'total_raised_btc_balances' : IDL.Nat64,
  });
  const CreateLaunchState = IDL.Record({
    'key' : IDL.Text,
    'create_pool_fee' : IDL.Nat64,
    'txid' : IDL.Text,
    'utxo' : Utxo,
    'register_pool_address' : IDL.Text,
    'nonce' : IDL.Nat64,
    'min_start_block_height' : IDL.Nat32,
  });
  const ExchangeState = IDL.Record({
    'rune_premine_amount' : IDL.Nat,
    'raising_target_max' : IDL.Nat64,
    'raising_target_min' : IDL.Nat64,
    'minimum_top_up_sats' : IDL.Nat64,
    'active_launch_pool_address_set' : IDL.Vec(IDL.Text),
    'uuid' : IDL.Nat64,
    'launch_duration_blocks' : IDL.Nat32,
    'register_pool_address' : IDL.Opt(IDL.Text),
    'rune_divisibility' : IDL.Nat8,
    'user_referral_codes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'launch_rune_reverse_for_lp_percent' : IDL.Nat8,
    'is_task_running' : IDL.Bool,
    'launch_rune_percent' : IDL.Nat8,
    'create_fee_sats' : IDL.Nat64,
    'launch_raised_btc_share' : LaunchRaisedBtcShare,
    'code_of_users' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const PoolStatus = IDL.Variant({
    'Init' : IDL.Null,
    'InitUtxoFinalized' : IDL.Null,
    'AddedLp' : IDL.Null,
    'LaunchSuccess' : IDL.Null,
    'AddingLp' : IDL.Null,
    'EtchFailed' : IDL.Text,
    'Processing' : IDL.Null,
    'Etching' : IDL.Null,
    'LaunchFailed' : IDL.Null,
  });
  const LogoParams = IDL.Record({
    'content_type' : IDL.Text,
    'content_base64' : IDL.Text,
  });
  const LaunchRuneEtchingArgs = IDL.Record({
    'rune_logo' : IDL.Opt(LogoParams),
    'rune_name' : IDL.Text,
    'rune_symbol' : IDL.Opt(IDL.Text),
  });
  const SocialInfo = IDL.Record({
    'twitter' : IDL.Opt(IDL.Text),
    'website' : IDL.Opt(IDL.Text),
    'discord' : IDL.Opt(IDL.Text),
    'telegram' : IDL.Opt(IDL.Text),
    'github' : IDL.Opt(IDL.Text),
  });
  const LaunchArgs = IDL.Record({
    'start_height' : IDL.Nat32,
    'social_info' : SocialInfo,
    'banner' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'raising_target_sats' : IDL.Nat64,
  });
  const PoolBusinessStateView = IDL.Record({
    'status' : PoolStatus,
    'creator' : IDL.Text,
    'start_height' : IDL.Nat32,
    'launch_rune_etching_args' : LaunchRuneEtchingArgs,
    'reveal_tx' : IDL.Opt(IDL.Text),
    'end_height' : IDL.Nat32,
    'pubkey' : IDL.Text,
    'btc_amount_for_lp' : IDL.Nat,
    'raising_target' : IDL.Nat64,
    'rune_premine' : IDL.Opt(IDL.Nat),
    'key_path' : IDL.Text,
    'highest_block_states' : IDL.Opt(BlockState),
    'rune_amount_for_lp' : IDL.Opt(IDL.Nat),
    'launch_args' : LaunchArgs,
    'rune_amount_for_launch' : IDL.Opt(IDL.Nat),
    'pool_address' : IDL.Text,
    'launch_raised_btc_share' : LaunchRaisedBtcShare,
    'add_lp_txid' : IDL.Opt(IDL.Text),
    'rune_id' : IDL.Opt(IDL.Text),
    'etch_commit_tx' : IDL.Opt(IDL.Text),
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
    'txid' : IDL.Text,
    'utxo' : Utxo,
    'event' : Event,
    'nonce' : IDL.Nat64,
  });
  const UserInfoOfLaunch = IDL.Record({
    'tune' : IDL.Nat8,
    'account' : IDL.Opt(Account),
    'launch_pool_address' : IDL.Text,
    'referred_by_code' : IDL.Opt(IDL.Text),
    'my_referral_code' : IDL.Opt(IDL.Text),
  });
  const NewBlockInfo = IDL.Record({
    'block_hash' : IDL.Text,
    'confirmed_txids' : IDL.Vec(IDL.Text),
    'block_timestamp' : IDL.Nat64,
    'block_height' : IDL.Nat32,
  });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ExchangeError });
  const RollbackTxArgs = IDL.Record({
    'txid' : IDL.Text,
    'reason_code' : IDL.Text,
  });
  return IDL.Service({
    'check_rune_name_available' : IDL.Func([IDL.Text], [Result], ['query']),
    'etching_for_launch' : IDL.Func([IDL.Text], [Result_1], []),
    'execute_tx' : IDL.Func([ExecuteTxArgs], [Result_2], []),
    'generate_referral_code' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_block_state' : IDL.Func([IDL.Text], [IDL.Vec(BlockState)], ['query']),
    'get_create_launch_info' : IDL.Func([], [CreateLaunchState], ['query']),
    'get_exchange_state' : IDL.Func([], [ExchangeState], ['query']),
    'get_launch_pool' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(PoolBusinessStateView)],
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
    'get_register_pool_address' : IDL.Func([], [IDL.Text], []),
    'get_user_info_of_launch' : IDL.Func(
        [IDL.Text, IDL.Text],
        [UserInfoOfLaunch],
        ['query'],
      ),
    'init_register_pool' : IDL.Func(
        [IDL.Text, IDL.Nat32, IDL.Nat64],
        [IDL.Text],
        [],
      ),
    'new_block' : IDL.Func([NewBlockInfo], [Result_3], []),
    'query_tx_event' : IDL.Func([IDL.Text], [IDL.Opt(Event)], ['query']),
    're_etching' : IDL.Func([IDL.Text, IDL.Text], [Result_4], []),
    'reset_blocks' : IDL.Func([], [Result_3], []),
    'rollback_tx' : IDL.Func([RollbackTxArgs], [Result_3], []),
    'set_user_referral_code' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_4],
        [],
      ),
    'tmp_reset_to_etched' : IDL.Func([IDL.Text], [], []),
    'tune' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat8], [Result_4], []),
  });
};
export const init = ({ IDL }) => {
  const LaunchRaisedBtcShare = IDL.Record({
    'referral_bonus_per_mille' : IDL.Nat16,
    'exchange_fee_per_mille' : IDL.Nat16,
    'lp_per_mille' : IDL.Nat16,
  });
  return [
    IDL.Nat64,
    IDL.Nat64,
    LaunchRaisedBtcShare,
    IDL.Nat,
    IDL.Nat8,
    IDL.Nat8,
    IDL.Nat8,
    IDL.Nat64,
    IDL.Nat64,
    IDL.Nat32,
  ];
};
