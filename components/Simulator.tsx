'use client';

import { useMemo, useState } from 'react';
import { AbandonmentPanel } from './AbandonmentPanel';
import { CompositionPanel } from './CompositionPanel';
import { Controls } from './Controls';
import { DcaMechanicsPanel } from './DcaMechanicsPanel';
import { KpiGrid } from './KpiGrid';
import { PortfolioChart } from './PortfolioChart';
import { RecoveryPanel } from './RecoveryPanel';
import { RoiChart } from './RoiChart';
import { YearTable } from './YearTable';
import { simulate } from '@/lib/simulate';

export const Simulator = () => {
  const [aporte, setAporte] = useState(100);
  const [capital, setCapital] = useState(10000);
  const [years, setYears] = useState(10);
  const result = useMemo(() => simulate(aporte, capital, years), [aporte, capital, years]);

  return (
    <main className="mx-auto flex w-full max-w-[760px] flex-col space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Controls
        aporte={aporte}
        capital={capital}
        years={years}
        onAporteChange={setAporte}
        onCapitalChange={setCapital}
        onYearsChange={setYears}
      />
      <KpiGrid result={result} />
      <PortfolioChart result={result} />
      <RecoveryPanel result={result} />
      <AbandonmentPanel result={result} />
      <DcaMechanicsPanel aporte={aporte} result={result} />
      <CompositionPanel result={result} />
      <RoiChart result={result} />
      <YearTable result={result} />
    </main>
  );
};
