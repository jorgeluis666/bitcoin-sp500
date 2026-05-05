import { fmt } from '@/lib/format';
import type { SimulationResult } from '@/lib/types';

interface CompositionPanelProps {
  result: SimulationResult;
}

const integerPercentages = (values: number[]) => {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return values.map(() => 0);

  const raw = values.map((value) => (value / total) * 100);
  const rounded = raw.map(Math.floor);
  let remaining = 100 - rounded.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);

  for (const item of order) {
    if (remaining <= 0) break;
    rounded[item.index] += 1;
    remaining -= 1;
  }

  return rounded;
};

export const CompositionPanel = ({ result }: CompositionPanelProps) => {
  const gain = result.ganancia;
  const positiveGain = Math.max(0, gain);
  const loss = Math.max(0, -gain);
  const values = gain >= 0
    ? [result.capitalUSD, result.aportesMensualesTotal, positiveGain]
    : [result.valorFinal, loss];
  const percentages = integerPercentages(values);
  const positiveSegments = [
    {
      label: 'Capital inicial',
      value: result.capitalUSD,
      pct: percentages[0],
      color: '#7F77DD',
    },
    {
      label: 'Aportes mensuales',
      value: result.aportesMensualesTotal,
      pct: percentages[1],
      color: '#1A73E8',
    },
    {
      label: 'Ganancia compuesta',
      value: positiveGain,
      pct: percentages[2],
      color: '#1E8E3E',
    },
  ];
  const lossSegments = [
    {
      label: 'Valor actual',
      value: result.valorFinal,
      pct: percentages[0],
      color: '#1A73E8',
    },
    {
      label: 'Pérdida temporal',
      value: loss,
      pct: percentages[1],
      color: '#D93025',
    },
  ];
  const segments = gain >= 0 ? positiveSegments : lossSegments;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-[var(--bg)]">
      <div>
        <h2 className="text-sm font-medium tracking-[-0.01em] text-[var(--text-primary)]">
          ¿De dónde viene tu cartera al final?
        </h2>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Compara tu dinero aportado con la ganancia compuesta; si el horizonte es corto puede aparecer pérdida temporal.
        </p>
      </div>

      <div className="mt-5 flex h-9 overflow-hidden rounded-lg bg-[var(--bg-subtle)]">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex min-w-0 items-center justify-center text-xs font-medium tabular-nums text-white"
            style={{
              flexGrow: segment.pct,
              flexBasis: 0,
              backgroundColor: segment.color,
              display: segment.pct === 0 ? 'none' : 'flex',
            }}
          >
            {segment.pct >= 8 ? `${segment.pct}%` : ''}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="min-w-0">
              <span className="block text-xs text-[var(--text-secondary)]">{segment.label}</span>
              <span className="block text-[13px] font-medium tabular-nums text-[var(--text-primary)]">${fmt(segment.value)}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
