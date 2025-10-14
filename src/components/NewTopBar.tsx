// import { useLaserEyes } from "@omnisat/lasereyes";
// import { Button, Modal, Skeleton, Typography } from "antd";
// import { connectWalletModalOpenAtom } from "atoms";
// import { useAtom } from "jotai";
// import { useEffect, useState } from "react";

// export function NewTopbar() {
//   const { isInitializing, disconnect, address } = useLaserEyes();

//   return (
//     <div className="mb-2 mt-2 px-2 flex w-full justify-between">
//       <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
//         <p className="text-2xl sm:text-md text-blue-500 font-normal tracking-wide opacity-80 italic">
//           SatsMan
//         </p>
//       </div>
//       <div>{address}</div>
//       <div className="mr-2">
//         {address ? <AccountButton /> : <ConnectButton />}
//       </div>
//     </div>
//   );
// }

// function AccountButton() {
//   const laserEyes = useLaserEyes();
//   const { isInitializing, disconnect, address } =
//     laserEyes;
// //   const {
// //     identity,
// //     // identityAddress,
// //     clear,
// //   } = useSiwbIdentity();

//   // useEffect(() => {
//   //   (async () => {
//   //     if (!address) {
//   //       return;
//   //     }

//   //     if (!identityAddress || identityAddress !== address) {
// 	// 	console.log("identityAddress not match, clear and setLaserEyes");
//   //       clear();
// 	// 	// @ts-ignore
//   //       await setLaserEyes(laserEyes, UNISAT);
//   //       prepareLogin();
//   //       const res = await login();
//   //       console.log("finish login", res);
//   //     }
//   //   })();
//   // }, [address]);

//   return (
//     <div>
//       {isInitializing ? (
//         <Skeleton />
//       ) : (
//         <div className="flex items-center ">

//           <div className="text-foreground relative flex items-center rounded-sm border border-orange-500 px-3 text-xl font-medium text-orange-500 md:text-2xl">
//             {shortenAddress(address!)}
//           </div>
//           <button
//             onClick={() => {
//               disconnect();
//             }}
//             className="ml-2 rounded-full bg-red-500/20 p-2 transition-all hover:bg-red-500/30"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-red-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// const shortenAddress = (addr: string) => {
//   if (!addr) return "";
//   return `${addr.slice(0, 6)}...${addr.slice(Math.max(0, addr.length - 4))}`;
// };

// export function ConnectButton() {
//   const [connectWalletModalOpen, setConnectWalletModalOpen] = useAtom(
//     connectWalletModalOpenAtom
//   );

// //   const { identity, clear } = useSiwbIdentity();

//   const handleClick = async () => {
//     setConnectWalletModalOpen(true);
//   };

//   const buttonText = "";

//   return (
//     <>
//       <button
//         className="px-4 py-2 mr-4 text-sm font-medium rounded-sm bg-gradient-to-r from-orange-400 to-orange-500 text-black hover:-translate-y-1"
//         onClick={handleClick}
//       >
//         Connect Wallet
//       </button>
//     </>
//   );
// }

// export default function ConnectWalletModal() {
//   const [connectWalletModalOpen, setConnectWalletModalOpen] = useAtom(
//     connectWalletModalOpenAtom
//   );
//   const p = useLaserEyes();

//   const [loading, setLoading] = useState<boolean>(false);
//   const [manually, setManually] = useState<boolean>(false);

//   return (
//     <Modal
//       className="z-50 w-80"
//       open={connectWalletModalOpen}
//       footer={null}
//       onCancel={() => {
//         setConnectWalletModalOpen(false);
//       }}
//     >
//       <Typography.Title> Select Wallet</Typography.Title>
//       <div className="mt-8">
//         <Button
//           key="unisat"
//           onClick={async () => {
//             setManually(true);
//             await setLaserEyes(p, UNISAT);
//           }}
//           disabled={loading}
//           block
//         >
//           Unisat Wallet
//         </Button>
//         {/* <Button
//           key="xverse"
//           onClick={async () => {
//             setManually(true);
//             await setLaserEyes(p, XVERSE);
//           }}
//           disabled={loading}
//           block
//         >
//           Xverse Wallet
//         </Button> */}
//       </div>
//       {loading && <Spin fullscreen />}
//     </Modal>
//   );
// }