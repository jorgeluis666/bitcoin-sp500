import { FX_PEN_USD, WISE_FEE } from '@/lib/prices';
import { fmt } from '@/lib/format';

interface ControlsProps {
  aporte: number;
  capital: number;
  onAporteChange: (value: number) => void;
  onCapitalChange: (value: number) => void;
}

const presets = [
  { label: 'Mínimo', aporte: 50, capital: 0 },
  { label: 'Plan base', aporte: 100, capital: 10000 },
  { label: 'Crecimiento', aporte: 250, capital: 15000 },
  { label: 'Máximo', aporte: 500, capital: 30000 },
];

export const Controls = ({ aporte, capital, onAporteChange, onCapitalChange }: ControlsProps) => {
  const capitalUsd = (capital / FX_PEN_USD) * (1 - WISE_FEE);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-medium leading-tight tracking-[-0.01em] text-[var(--text-primary)]">
            Simulador a 10 años
          </h1>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            Plan DCA con capital inicial para un inversor peruano.
          </p>
        </div>
        <span className="w-fit rounded-full bg-[var(--blue-soft)] px-2.5 py-1 text-xs font-medium text-[var(--blue-text)]">
          Cálculo en vivo
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              onAporteChange(preset.aporte);
              onCapitalChange(preset.capital);
            }}
            className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            {preset.label} (${fmt(preset.aporte)}, S/{fmt(preset.capital)})
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-[var(--bg-subtle)] p-4">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="flex items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
              <span>Aporte mensual</span>
              <span className="tabular-nums text-[13px] font-medium text-[var(--text-primary)]">${fmt(aporte)}</span>
            </span>
            <input
              aria-label="Aporte mensual"
              className="mt-3"
              type="range"
              min={50}
              max={500}
              step={25}
              value={aporte}
              onChange={(event) => onAporteChange(Number(event.target.value))}
            />
            <span className="mt-2 flex justify-between text-[11px] text-[var(--text-tertiary)]">
              <span>$50</span>
              <span>$500</span>
            </span>
          </label>

          <label className="block">
            <span className="flex items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
              <span>Capital inicial</span>
              <span className="tabular-nums text-[13px] font-medium text-[var(--text-primary)]">S/{fmt(capital)}</span>
            </span>
            <input
              aria-label="Capital inicial"
              className="mt-3"
              type="range"
              min={0}
              max={30000}
              step={1000}
              value={capital}
              onChange={(event) => onCapitalChange(Number(event.target.value))}
            />
            <span className="mt-2 flex justify-between text-[11px] text-[var(--text-tertiary)]">
              <span>S/0</span>
              <span>S/30,000</span>
            </span>
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-[var(--separator)] pt-3 text-xs text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Capital USD neto: <span className="tabular-nums font-medium text-[var(--text-primary)]">${fmt(capitalUsd)}</span>
          </span>
          <span>Asignación: 80% S&amp;P 500 / 20% BTC</span>
        </div>
      </div>
    </section>
  );
};
