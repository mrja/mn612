/// <reference types="react" />

import React, { Suspense } from 'react';
import GenerativeLogo from './components/GenerativeLogo';
import UtilityLinks from './components/UtilityLinks';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      <ErrorBoundary fallback={<div className="text-red-500">Something went wrong with the simulation.</div>}>
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <GenerativeLogo />
        </Suspense>
      </ErrorBoundary>
      <UtilityLinks />
    </main>
  );
};

export default App;