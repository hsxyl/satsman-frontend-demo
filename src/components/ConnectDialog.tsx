import { useEffect, useState } from "react";
import { Button, Modal, Spin, Typography } from "antd";
import { useSiwbIdentity } from "ic-siwb-lasereyes-connector";
import {
  ContentType,
  NetworkType,
  ProviderType,
  UNISAT,
  useLaserEyes,
  WIZZ,
  XVERSE,
} from "@omnisat/lasereyes";
import { atom, useAtom } from "jotai";

export const connectWalletModalOpenAtom = atom(false);

export default function ConnectWalletModal() {
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useAtom(
    connectWalletModalOpenAtom
  );
  const p = useLaserEyes();

  const {
    prepareLogin,
    isPrepareLoginIdle,
    prepareLoginError,
    loginError,
    setLaserEyes,
    login,
    getAddress,
    getPublicKey,
    connectedBtcAddress,
    identity,
    identityPublicKey,
  } = useSiwbIdentity();

  // setLaserEyes(p)

  // setLaserEyes({
  //   address: p.paymentAddress,
  //   isInitializing: false,
  //   connected: false,
  //   isConnecting: false,
  //   publicKey: "",
  //   paymentAddress: "",
  //   paymentPublicKey: "",
  //   balance: undefined,
  //   network: "mainnet",
  //   library: undefined,
  //   provider: undefined,
  //   accounts: [],
  //   hasUnisat: false,
  //   hasXverse: false,
  //   hasOrange: false,
  //   hasOpNet: false,
  //   hasOyl: false,
  //   hasMagicEden: false,
  //   hasOkx: false,
  //   hasLeather: false,
  //   hasPhantom: false,
  //   hasWizz: false,
  //   connect: function (walletName: ProviderType): Promise<void> {
  //     throw new Error("Function not implemented.");
  //   },
  //   disconnect: function (): void {
  //     throw new Error("Function not implemented.");
  //   },
  //   requestAccounts: function (): Promise<string[]> {
  //     throw new Error("Function not implemented.");
  //   },
  //   getNetwork: function (): Promise<string | undefined> {
  //     throw new Error("Function not implemented.");
  //   },
  //   switchNetwork: function (network: NetworkType): Promise<void> {
  //     throw new Error("Function not implemented.");
  //   },
  //   getPublicKey: function (): Promise<string> {
  //     throw new Error("Function not implemented.");
  //   },
  //   getBalance: function (): Promise<string> {
  //     throw new Error("Function not implemented.");
  //   },
  //   getInscriptions: function (): Promise<any[]> {
  //     throw new Error("Function not implemented.");
  //   },
  //   sendBTC: function (to: string, amount: number): Promise<string> {
  //     throw new Error("Function not implemented.");
  //   },
  //   signMessage: function (
  //     message: string,
  //     toSignAddress?: string | undefined
  //   ): Promise<string> {
  //     throw new Error("Function not implemented.");
  //   },
  //   signPsbt: function (
  //     tx: string,
  //     finalize?: boolean | undefined,
  //     broadcast?: boolean | undefined
  //   ): Promise<
  //     | {
  //         signedPsbtHex: string | undefined;
  //         signedPsbtBase64: string | undefined;
  //         txId?: string | undefined;
  //       }
  //     | undefined
  //   > {
  //     throw new Error("Function not implemented.");
  //   },
  //   pushPsbt: function (tx: string): Promise<string | undefined> {
  //     throw new Error("Function not implemented.");
  //   },
  //   inscribe: function (
  //     contentBase64: string,
  //     mimeType: ContentType
  //   ): Promise<string | string[]> {
  //     throw new Error("Function not implemented.");
  //   },
  // });

  const [loading, setLoading] = useState<boolean>(false);
  const [manually, setManually] = useState<boolean>(false);

  /**
   * Preload a Siwb message on every address change.
   */
  useEffect(() => {
    if (!isPrepareLoginIdle) return;
    // setLaserEyes(p)
    const address = getAddress();
    const pubkey = getPublicKey();
    console.log({ address, pubkey, identityPublicKey, connectedBtcAddress });

    if (address) {
      console.log({
        address,
        // canisterId: process.env.
      });
      prepareLogin();
      if (connectedBtcAddress && !identity && manually) {
        (async () => {
          setLoading(true);
          const res = await login();
          setLoading(false);
          if (res) {
            setManually(false);
            setConnectWalletModalOpen(false);
          }
        })();
      }
    }
  }, [
    prepareLogin,
    isPrepareLoginIdle,
    getAddress,
    login,
    connectedBtcAddress,
    identity,
    manually,
  ]);

  /**
   * Show an error toast if the prepareLogin() call fails.
   */
  useEffect(() => {}, [prepareLoginError]);

  /**
   * Show an error toast if the login call fails.
   */
  useEffect(() => {}, [loginError]);

  return (
    <Modal
      className="z-50 w-80"
      open={connectWalletModalOpen}
      footer={null}
      onCancel={() => {
        setConnectWalletModalOpen(false);
      }}
    >
      <Typography.Title> Select Wallet</Typography.Title>
      <div className="mt-8">
        <Button
          key="unisat"
          onClick={async () => {
            setManually(true);
            await setLaserEyes(p, UNISAT);
          }}
          disabled={loading}
          block
        >
          Unisat Wallet
        </Button>
        {/* <Button
          key="xverse"
          onClick={async () => {
            setManually(true);
            await setLaserEyes(p, XVERSE);
          }}
          disabled={loading}
          block
        >
          Xverse Wallet
        </Button> */}
      </div>
      {loading && <Spin fullscreen />}
    </Modal>
  );
}
