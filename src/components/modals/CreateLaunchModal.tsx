import { Button, Form, Input, InputNumber, Modal } from "antd";
import { useAtom } from "jotai";
import type { FormProps } from "antd";
import { useRee, utils as reeUtils } from "@omnity/ree-client-ts-sdk";
import { createLaunchModalOpenAtom } from "../../atoms";
import { satsmanActor } from "../../canister/satsman/actor";
import { useLaserEyes } from "@omnisat/lasereyes";
import { getNetworkType } from "../../utils";

type FieldType = {
  gameName?: string;
  registerFee?: number;
  claimCoolingDown?: number;
  claimAmountPerClick?: number;
  runePremineAmount?: number;
};

export function CreateLaunchModal() {
  const [createLaunchModalOpen, setCreateLaunchModalOpen] = useAtom(
    createLaunchModalOpenAtom
  );
  const { createTransaction } = useRee();

  // const { identity, identityAddress,  } = useSiwbIdentity();
  const { signPsbt, paymentAddress } = useLaserEyes();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Form values:", values);

    try {
      const create_launch_state = await satsmanActor.query_create_launch_info();
      const tx = await createTransaction();
      tx.addIntention({
        poolAddress: create_launch_state.register_pool_address,
        action: "create_launch",
        poolUtxos: [
          reeUtils.formatPoolUtxo(
            create_launch_state.register_pool_address,
            {
              txid: create_launch_state.utxo.txid,
              sats: BigInt(create_launch_state.create_pool_fee),
              vout: create_launch_state.utxo.vout,
              coins: [create_launch_state.utxo.coins[0]],
            },
            getNetworkType()
          )
        ],
        inputCoins: [
          {
            coin: {
              id: "0:0",
              value: BigInt(create_launch_state.create_pool_fee),
            },
            from: paymentAddress,
          },
        ],
        outputCoins: [],
        nonce: create_launch_state.nonce,
      });

      const { psbt } = await tx.build();
      const res = await signPsbt(psbt.toBase64());
      const signedPsbtHex = res?.signedPsbtHex ?? "";
      if (!signedPsbtHex) {
        throw new Error("Sign Failed");
      }
      const txid = await tx.send(signedPsbtHex);

      window.alert("Transaction sent with txid: " + txid);

    } catch (error) {
      console.error("Error creating game:", error);
      window.alert("Error creating game: " + (error as Error).message);
    }
  };

  return (
    <Modal
      title="Create Game"
      open={createLaunchModalOpen}
      onCancel={() => setCreateLaunchModalOpen(false)}
      onOk={() => {
        // Handle form submission logic here
        setCreateLaunchModalOpen(false);
      }}
      footer={null}
    >
      <Form name="create-game" onFinish={onFinish}>
        <Form.Item<FieldType>
          label="Game Name"
          name="gameName"
          rules={[{ required: true, message: "Please input your game name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Register Fee"
          name="registerFee"
          rules={[
            { required: true, message: "Please input your register fee!" },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<FieldType>
          label="Click Cooling Down(Seconds)"
          name="claimCoolingDown"
          rules={[
            {
              required: true,
              message: "Please input your click cooling down!",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<FieldType>
          label="Claim Amount Per Click"
          name="claimAmountPerClick"
          rules={[
            {
              required: true,
              message: "Please input your claim amount per click!",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<FieldType>
          label="Rune Premine Amount"
          name="runePremineAmount"
          rules={[
            {
              required: true,
              message: "Please input your rune premine amount!",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
