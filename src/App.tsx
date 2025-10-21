import ConnectWalletModal from "./components/ConnectDialog";
import { Topbar } from "./layout/Topbar";

import { Home } from "./pages/Home";
import { lazy, Suspense, use } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingOrError } from "./components/LoadingOrError";
import { Launch } from "pages/Launch";
import { CreateLaunch } from "pages/CreateLaunch";
import { useRee } from "@omnity/ree-client-ts-sdk";
import { AllLaunch } from "pages/AllLaunch";
import { UserProfile } from "pages/UserProfile";

function renderError({ error }: FallbackProps) {
  return <LoadingOrError error={error} />;
}

export function App() {
  const { client, address, paymentAddress } = useRee();
  console.log({ client, address, paymentAddress });
  return (
    <BrowserRouter>
      <ErrorBoundary fallbackRender={renderError}>
        <Suspense fallback={<LoadingOrError />}>
        <div className="text-black">
          <Topbar />
          <Routes>
            <Route element={<Home />} index={true} />
            <Route element={<CreateLaunch />} path="/create" />
            <Route element={<Launch />} path="/launch/:pool_address" />
            <Route element={<AllLaunch />} path="/all_launch" />
            <Route element={<UserProfile />} path="/profile/:user_address" />
          </Routes>
          <ConnectWalletModal />
        </div>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
