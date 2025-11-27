import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { LaserEyesProvider, TESTNET4 } from "@omnisat/lasereyes";
// @ts-ignore
import { SiwbIdentityProvider } from "oct-ic-siwb-lasereyes-connector";
import type { _SERVICE as siwbService } from "./canister/siwb/ic_siwb_provider.d.ts";
import { idlFactory as siwbIdl } from "./canister/siwb/ic_siwb_provider.idl";
import { ReeProvider } from "@omnity/ree-client-ts-sdk";
import { idlFactory } from "canister/satsman/service.did";
import {
  SATSMAN_CANISTER_ID,
  SATSMAN_EXCHANGE_ID,
} from "canister/satsman/actor";

declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function () { return this.toString() }

const MAX_RETRIES = 1;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      retry: MAX_RETRIES,
    },
  },
});

const container = document.querySelector("#root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <LaserEyesProvider config={{ network: TESTNET4 }}>
          <ReeProvider
            config={{
              network: "testnet",
              maestroApiKey: "f3nf6OqNEoWy7PtdtXqzP0SWyJZxtWYf",
              exchangeIdlFactory: idlFactory,
              exchangeId: SATSMAN_EXCHANGE_ID,
              exchangeCanisterId: SATSMAN_CANISTER_ID,
            }}
          >
            <SiwbIdentityProvider<siwbService>
              canisterId={"xhwud-7yaaa-aaaar-qbyqa-cai"}
              idlFactory={siwbIdl}
              httpAgentOptions={{ host: "https://icp0.io" }} // use only in local canister
            >
              <App />
            </SiwbIdentityProvider>
          </ReeProvider>
        </LaserEyesProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
