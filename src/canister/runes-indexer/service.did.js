export const idlFactory = ({ IDL }) => {
  const UpgradeArgs = IDL.Record({
    'bitcoin_rpc_url' : IDL.Opt(IDL.Text),
    'subscribers' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  const BitcoinNetwork = IDL.Variant({
    'mainnet' : IDL.Null,
    'regtest' : IDL.Null,
    'testnet' : IDL.Null,
  });
  const Config = IDL.Record({
    'bitcoin_rpc_url' : IDL.Text,
    'network' : BitcoinNetwork,
    'subscribers' : IDL.Vec(IDL.Principal),
  });
  const RunesIndexerArgs = IDL.Variant({
    'Upgrade' : IDL.Opt(UpgradeArgs),
    'Init' : Config,
  });
  const OrdinalsTerms = IDL.Record({
    'cap' : IDL.Nat,
    'height' : IDL.Tuple(IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64)),
    'offset' : IDL.Tuple(IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64)),
    'amount' : IDL.Nat,
  });
  const LogoParams = IDL.Record({
    'content_type' : IDL.Text,
    'content_base64' : IDL.Text,
  });
  const EtchingArgs = IDL.Record({
    'terms' : IDL.Opt(OrdinalsTerms),
    'turbo' : IDL.Bool,
    'premine' : IDL.Opt(IDL.Nat),
    'logo' : IDL.Opt(LogoParams),
    'rune_name' : IDL.Text,
    'divisibility' : IDL.Opt(IDL.Nat8),
    'premine_receiver' : IDL.Text,
    'symbol' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const UtxoArgs = IDL.Record({
    'id' : IDL.Text,
    'index' : IDL.Nat32,
    'amount' : IDL.Nat64,
  });
  const EtchingStateArgs = IDL.Record({
    'ecdsa_key_name' : IDL.Text,
    'etching_fee' : IDL.Opt(IDL.Nat64),
    'btc_network' : BitcoinNetwork,
    'mpc_principal' : IDL.Opt(IDL.Principal),
  });
  const EtchingUpgradeArgs = IDL.Variant({
    'Upgrade' : IDL.Opt(EtchingStateArgs),
    'Init' : EtchingStateArgs,
  });
  const GetEtchingResult = IDL.Record({
    'confirmations' : IDL.Nat32,
    'rune_id' : IDL.Text,
  });
  const EtchingStatus = IDL.Variant({
    'SendRevealSuccess' : IDL.Null,
    'SendRevealFailed' : IDL.Null,
    'SendCommitFailed' : IDL.Null,
    'SendCommitSuccess' : IDL.Null,
    'Final' : IDL.Null,
    'Initial' : IDL.Null,
  });
  const SendEtchingInfo = IDL.Record({
    'status' : EtchingStatus,
    'script_out_address' : IDL.Text,
    'err_info' : IDL.Text,
    'commit_txid' : IDL.Text,
    'time_at' : IDL.Nat64,
    'etching_args' : EtchingArgs,
    'receiver' : IDL.Text,
    'reveal_txid' : IDL.Text,
  });
  const Terms = IDL.Record({
    'cap' : IDL.Opt(IDL.Nat),
    'height' : IDL.Tuple(IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64)),
    'offset' : IDL.Tuple(IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64)),
    'amount' : IDL.Opt(IDL.Nat),
  });
  const RuneEntry = IDL.Record({
    'confirmations' : IDL.Nat32,
    'mints' : IDL.Nat,
    'terms' : IDL.Opt(Terms),
    'etching' : IDL.Text,
    'turbo' : IDL.Bool,
    'premine' : IDL.Nat,
    'divisibility' : IDL.Nat8,
    'spaced_rune' : IDL.Text,
    'number' : IDL.Nat64,
    'timestamp' : IDL.Nat64,
    'block' : IDL.Nat64,
    'burned' : IDL.Nat,
    'rune_id' : IDL.Text,
    'symbol' : IDL.Opt(IDL.Text),
  });
  const RuneBalance = IDL.Record({
    'confirmations' : IDL.Nat32,
    'divisibility' : IDL.Nat8,
    'amount' : IDL.Nat,
    'rune_id' : IDL.Text,
    'symbol' : IDL.Opt(IDL.Text),
  });
  const Error = IDL.Variant({ 'MaxOutpointsExceeded' : IDL.Null });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Opt(IDL.Vec(RuneBalance))),
    'Err' : Error,
  });
  const EtchingAccountInfo = IDL.Record({
    'derive_path' : IDL.Text,
    'pubkey' : IDL.Text,
    'address' : IDL.Text,
  });
  const SetTxFeePerVbyteArgs = IDL.Record({
    'low' : IDL.Nat64,
    'high' : IDL.Nat64,
    'medium' : IDL.Nat64,
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  return IDL.Service({
    'etching' : IDL.Func([EtchingArgs], [Result], []),
    'etching_fee_utxos' : IDL.Func([], [IDL.Vec(UtxoArgs)], ['query']),
    'etching_post_upgrade' : IDL.Func([EtchingUpgradeArgs], [], []),
    'get_etching' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(GetEtchingResult)],
        ['query'],
      ),
    'get_etching_request' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(SendEtchingInfo)],
        ['query'],
      ),
    'get_latest_block' : IDL.Func([], [IDL.Nat32, IDL.Text], ['query']),
    'get_rune' : IDL.Func([IDL.Text], [IDL.Opt(RuneEntry)], ['query']),
    'get_rune_balances_for_outputs' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [Result_1],
        ['query'],
      ),
    'get_rune_by_id' : IDL.Func([IDL.Text], [IDL.Opt(RuneEntry)], ['query']),
    'init_etching_sender_account' : IDL.Func([], [EtchingAccountInfo], []),
    'query_etching_fee' : IDL.Func([], [IDL.Nat64], ['query']),
    'set_etching_fee_utxos' : IDL.Func([IDL.Vec(UtxoArgs)], [], []),
    'set_tx_fee_per_vbyte' : IDL.Func([SetTxFeePerVbyteArgs], [Result_2], []),
  });
};
export const init = ({ IDL }) => {
  const UpgradeArgs = IDL.Record({
    'bitcoin_rpc_url' : IDL.Opt(IDL.Text),
    'subscribers' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  const BitcoinNetwork = IDL.Variant({
    'mainnet' : IDL.Null,
    'regtest' : IDL.Null,
    'testnet' : IDL.Null,
  });
  const Config = IDL.Record({
    'bitcoin_rpc_url' : IDL.Text,
    'network' : BitcoinNetwork,
    'subscribers' : IDL.Vec(IDL.Principal),
  });
  const RunesIndexerArgs = IDL.Variant({
    'Upgrade' : IDL.Opt(UpgradeArgs),
    'Init' : Config,
  });
  return [RunesIndexerArgs];
};
