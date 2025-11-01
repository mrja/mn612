/// <reference types="react" />

import React, { Suspense } from 'react';
import GenerativeLogo from './components/GenerativeLogo';
import UtilityLinks from './components/UtilityLinks';

const App: React.FC = () => {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <GenerativeLogo />
      </Suspense>
      <UtilityLinks />
    </main>
  );
};

export default App;