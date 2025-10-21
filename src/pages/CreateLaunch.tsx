import { useLaserEyes } from "@omnisat/lasereyes";
import { useRee } from "@omnity/ree-client-ts-sdk";
import {
  Button,
  Divider,
  Dropdown,
  Form,
  FormProps,
  Input,
  Select,
  Space,
} from "antd";
import { convertMaestroUtxo } from "api/maestro";
import { indexerActor } from "canister/runes-indexer/actor";
import { satsmanActor } from "canister/satsman/actor";
import { useLatestBlockHeight } from "hooks/use-mempool";
import { useLaunchPools } from "hooks/use-pool";
import { useLoginUserBtcUtxo } from "hooks/use-utxos";
import { useState } from "react";
import { convertUtxo, createTx } from "utils";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

type FieldType = {
  rune_name?: string;
  token_for_auction?: string;
  token_for_lp?: string;
  raising_target_sats?: number;
  income_distribution?: IncomeDistributionItem[];
  auction_start_height?: number;
  span_blocks?: string;
};

type IncomeDistributionItem = {
  label: string;
  percentage: number;
  address: string;
};

export function CreateLaunch() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [calling, setCalling] = useState<boolean>(false);

  //   const { data: btcUtxos, isLoading: isLoadingUtxo } = useLoginUserBtcUtxo();
  const { data: latestBlockHeight } = useLatestBlockHeight();
  const { signPsbt } = useLaserEyes();
  const { createTransaction, address, paymentAddress } = useRee();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("onFinish:", values);
    setCalling(true);
    try {
      if (!address || !paymentAddress) {
        alert("Please connect your wallet first.");
        return;
      }
      let create_launch_state = await satsmanActor.get_create_launch_info();

      let rune = await indexerActor.get_rune(values.rune_name!);
      let rune_id = rune[0]!.rune_id;
      const tx = await createTransaction();
    //   let poolUtxo = convertUtxo(
    //     create_launch_state.utxo,
    //     create_launch_state.key
    //   );
      let action_params = {
        rune_name: values.rune_name,
        rune_id: rune_id,
        token_for_auction: values.token_for_auction!,
        token_for_lp: values.token_for_lp!,
        raising_target_sats: values.raising_target_sats! * 1000,
        income_distribution: values.income_distribution!.map((item) => ({
          label: item.label,
          percentage: Number(item.percentage!),
          address: item.address,
        })),
        description: null,
        social_info: {
          twitter: null,
          github: null,
          discord: null,
          telegram: null,
          website: null,
        },
        start_height: Number(values.auction_start_height!),
        span_blocks: Number(values.span_blocks!) * 144,
      };

      console.log({ action_params: JSON.stringify(action_params) });
    //   return

      let new_pool_address = await satsmanActor.new_pool(paymentAddress)
      let total_rune_amount = BigInt(
        values.token_for_auction!) + BigInt(values.token_for_lp!);
      console.log({ new_pool_address, rune_id, total_rune_amount });
      tx.addIntention({
        poolAddress: new_pool_address,
        poolUtxos: [],
        action: "create_launch",
        inputCoins: [
          {
            from: paymentAddress,
            coin: {
              id: "0:0",
              value: create_launch_state.create_pool_fee,
            },
          },
          {
            from: paymentAddress,
            coin: {
              id: rune_id,
              value: BigInt(values.token_for_auction!) + BigInt(values.token_for_lp!),
            },
          },
        ],
        outputCoins: [],
        actionParams: JSON.stringify(action_params),
        nonce: BigInt(0),
      });

      const { psbt } = await tx.build();
      const res = await signPsbt(psbt.toBase64());
      const signedPsbtHex = res!.signedPsbtHex!;
      const txid = await tx.send(signedPsbtHex);

      console.log("invoke success and txid ", txid);
      alert("Create Launch Success: " + txid);
      window.location.assign(`/`);
    } catch (e) {
      console.error(e);
      alert("Create Launch failed: " + (e as Error).message);
    } finally {
      setCalling(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#f0f2f5]">
      <Form onFinish={onFinish} layout="horizontal" style={{ maxWidth: 600 }}>
        <h1 className="text-2xl my-4">Token Information</h1>
        <Form.Item name="rune_name" label="Rune Name: ">
          <Input placeholder="MY•TOKEN•NAME" />
        </Form.Item>
        <div className="border-t border-b border-gray-300 my-4 border-dashed" />
        <h1 className="text-2xl my-4">Launch Plan</h1>
        <Form.Item name="token_for_auction" label="Token for Auction: ">
          <Input placeholder="4,000,000" />
        </Form.Item>
        <Form.Item name="token_for_lp" label="Token for Lp: ">
          <Input placeholder="2,000,000" />
        </Form.Item>
        <Form.Item name="raising_target_sats" label="Raising Target(K sats): ">
          <Input placeholder="10-1000" />
        </Form.Item>
        <Form.Item name="auction_start_height" label="Auction Start Height">
          <Input placeholder="915501-919389" />
        </Form.Item>
        <Form.Item name="span_blocks" label="Span Blocks">
          <Select>
            <Select.Option value="3">144 * 3</Select.Option>
            <Select.Option value="4">144 * 4</Select.Option>
            <Select.Option value="5">144 * 5</Select.Option>
            <Select.Option value="6">144 * 6</Select.Option>
            <Select.Option value="7">144 * 7</Select.Option>
          </Select>
        </Form.Item>
        <p className="mr-4">50% token auction income will be receive by:</p>
        <Form.List name="income_distribution">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "label"]}
                    rules={[{ required: true, message: "Missing label" }]}
                  >
                    <Input placeholder="Label" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "percentage"]}
                    rules={[{ required: true, message: "Missing percentage" }]}
                  >
                    <Input placeholder="Percentage" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "address"]}
                    rules={[{ required: true, message: "Missing address" }]}
                  >
                    <Input placeholder="Address" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Item
                </Button>
              </Form.Item>
              <Form.Item>
                <Button loading={calling} type="primary" htmlType="submit">
                  Kick off Launch
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>

      {/* <Button
        onClick={async () => {
          setCalling(true);
          try {
            if (!address || !paymentAddress) {
              alert("Please connect your wallet first.");
              return;
            }
            let create_launch_state =
              await satsmanActor.get_create_launch_info();

            const tx = await createTransaction();
            let poolUtxo = convertUtxo(
              create_launch_state.utxo,
              create_launch_state.key
            );
            tx.addIntention({
              poolAddress: create_launch_state.register_pool_address,
              poolUtxos: [
                {
                  txid: poolUtxo.txid,
                  vout: poolUtxo.vout,
                  satoshis: poolUtxo.satoshis.toString(),
                  runes: poolUtxo.runes,
                  address: poolUtxo.address,
                  scriptPk: poolUtxo.scriptPk,
                },
              ],
              action: "create_launch",
              inputCoins: [
                {
                  from: paymentAddress,
                  coin: {
                    id: "0:0",
                    value: create_launch_state.create_pool_fee,
                  },
                },
              ],
              outputCoins: [],
              actionParams: JSON.stringify({
                launch_args: {
                  start_height: Number(startHeight),
                  raising_target_sats: Number(raisingTarget) * 1000,
                  social_info: {},
                },
                launch_rune_etching_args: {
                  rune_name: runeName,
                },
              }),
              nonce: create_launch_state.nonce,
            });

            const { psbt } = await tx.build();
            const res = await signPsbt(psbt.toBase64());
            const signedPsbtHex = res!.signedPsbtHex!;
            const txid = await tx.send(signedPsbtHex);

            console.log("invoke success and txid ", txid);
            alert("Create Launch Success: " + txid);
            window.location.assign(`/`);
          } catch (e) {
            console.error(e);
            alert("Create Launch failed: " + (e as Error).message);
          } finally {
            setCalling(false);
          }
        }}
        type="primary"
        // disabled={!runeName || !startHeight || !raisingTarget}
        loading={calling}
      >
        Kick-off Launch
      </Button> */}
    </div>
  );
}
