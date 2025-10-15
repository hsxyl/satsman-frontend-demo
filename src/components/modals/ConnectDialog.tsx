// import { useEffect, useState, useCallback } from 'react';
// import { UNISAT, XVERSE, MAGIC_EDEN, ProviderType, useLaserEyes } from '@omnisat/lasereyes';
// import { useRee } from "@omnity/ree-client-ts-sdk";
// import { WALLETS } from '../../constants';
// import { Spin } from 'antd';
// import { useAtom } from 'jotai';
// import { connectWalletModalOpenAtom } from '../../atoms';


// export default function ConnectWalletModal() {
//   const [connectWalletModalOpen, setConnectWalletModalOpen] = useAtom(connectWalletModalOpenAtom);;
//   const { updateWallet } = useRee();
//   const { address, paymentAddress, connect, isConnecting, hasUnisat, hasXverse, hasMagicEden } = useLaserEyes();
//   const [connectingWallet, setConnectingWallet] = useState<string>();

//   useEffect(() => {
//     updateWallet({
//       address,
//       paymentAddress,
//     });
//     console.log("update wallet", { address, paymentAddress });
//   }, [address, paymentAddress]);

//   const walletList = [UNISAT, XVERSE, MAGIC_EDEN];

//   const getInstalled = (wallet: string) => {
//     if (wallet === UNISAT) return hasUnisat;
//     if (wallet === XVERSE) return hasXverse;
//     if (wallet === MAGIC_EDEN) return hasMagicEden;
//     return false;
//   };

//   const onConnectWallet = useCallback(async (wallet: string) => {
//     if (!getInstalled(wallet)) {
//       window.open(WALLETS[wallet]?.url, "_blank");
//       return;
//     }
//     setConnectingWallet(wallet);
//     try {
//       await connect(wallet as ProviderType);
//       setConnectingWallet(undefined);
//       setConnectWalletModalOpen(false);
//     } catch (err) {
//       console.log(err);
//       setConnectingWallet(undefined);
//     }
//   }, [setConnectingWallet, connect, getInstalled, connectingWallet]);

//   if (!connectWalletModalOpen) return null;

//   return (
//     <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full shadow-xl">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-display font-bold tracking-tight">Select Wallet</h3>
//           <button
//             onClick={() => setConnectWalletModalOpen(false)}
//             className="text-gray-500 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
//           >
//             ✕
//           </button>
//         </div>
//         <div className="flex flex-col gap-2 mt-2">
//           {walletList.map(wallet => (
//             <div
//               key={wallet}
//               className={`flex items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] ${isConnecting && connectingWallet !== wallet ? 'pointer-events-none opacity-50 transform-none' : ''}`}
//               onClick={() => onConnectWallet(wallet)}
//             >
//               <div className="flex items-center">
//                 <img
//                   src={WALLETS[wallet]?.icon}
//                   className="w-8 h-8 rounded-lg"
//                   alt={WALLETS[wallet]?.name}
//                 />
//                 <span className="font-semibold text-lg ml-2 tracking-wide">{WALLETS[wallet]?.name}</span>
//                 {connectingWallet === wallet && <Spin className="ml-2" />}
//               </div>
//               {getInstalled(wallet) && (
//                 <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">Detected</span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }