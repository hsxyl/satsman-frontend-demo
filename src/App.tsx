import ConnectWalletModal from "./components/ConnectDialog";
import { Topbar } from "./layout/Topbar";

import { Home } from "./pages/Home";
import { lazy, Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingOrError } from "./components/LoadingOrError";
import { Launch } from "pages/Launch";
import { CreateLaunch } from "pages/CreateLaunch";

function renderError({ error }: FallbackProps) {
  return <LoadingOrError error={error} />;
}

export function App() {
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
            {/* <Route path='/debug/:address' element={<Debug />} /> */}
          </Routes>
          {/* <CreateGameModal /> */}
          <ConnectWalletModal />

        </div>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
