import { UNISAT, useLaserEyes } from "@omnisat/lasereyes";
// import { AccountButton } from "../account-button";
import { useEffect, useState } from "react";
// import { MenuButton } from "./menu-button";
import { AccountButton } from "../components/AccountButton";
import ConnectButton from "../components/ConnectButton";
import { Button, Divider, Skeleton } from "antd";
import { Link } from "react-router-dom";
// @ts-ignore
import { useSiwbIdentity } from "oct-ic-siwb-lasereyes-connector";
import { useRee } from "@omnity/ree-client-ts-sdk";

export function Topbar() {
  const { address } = useLaserEyes();

  const { identityAddress } = useSiwbIdentity();

  return (
    <div>
      <div className="mb-4 mt-8 px-2 flex w-full justify-between">
        <Link to="/">
          <p className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
            Satsman
          </p>
          {/* <img src='/logo.png' alt='Logo' className='mx-6 h-20' /> */}
        </Link>

		<Link to="/all_launch">
          <p className="border border-orange-500 px-3 py-1 rounded-md text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
            All Launches
          </p>
          {/* <img src='/logo.png' alt='Logo' className='mx-6 h-20' /> */}
        </Link>

		<Link to={`/profile/${address}`}>
          <p className="border border-orange-500 px-3 py-1 rounded-md text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
            Profile
          </p>
          {/* <img src='/logo.png' alt='Logo' className='mx-6 h-20' /> */}
        </Link>

        <div className="mr-2">
          {address && identityAddress ? <AccountButton /> : <ConnectButton />}
        </div>
      </div>
    </div>
  );
}
