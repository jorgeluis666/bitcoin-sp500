import { fmt } from '@/lib/format';
import type { SimulationResult } from '@/lib/types';

interface RecoveryPanelProps {
  result: SimulationResult;
}

export const RecoveryPanel = ({ result }: RecoveryPanelProps) => {
  const firstYear = result.yearROI[0];
  const breakEvenValue = result.breakEvenMes === null ? null : result.valores[result.breakEvenMes - 1];
  const breakEvenInvested = result.breakEvenMes === null ? null : result.aportesAcum[result.breakEvenMes - 1];
  const recoveryLabel = result.breakEvenMes === null
    ? 'No recupera en este horizonte'
    : `Mes ${result.breakEvenMes}`;
  const recoveryDetail = result.recoveryMonths === null
    ? 'El horizonte elegido termina antes de volver a estar en verde.'
    : `${result.recoveryMonths} meses desde el peor punto.`;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-[var(--bg)]">
      <div>
        <h2 className="text-sm font-medium tracking-[-0.01em] text-[var(--text-primary)]">
          Datos de recuperación
        </h2>
        <p className="mt-1 text-[13px] leading-5 text-[var(--text-secondary)]">
          El año 1 negativo no predice que el próximo año será malo: es un shock inicial para ver si el plan aguanta
          antes de la recuperación histórica del escenario.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
        <article className="rounded-lg bg-[var(--red-soft)] p-4 text-[var(--red-text)]">
          <p className="text-xs">Peor punto</p>
          <p className="mt-2 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums">
            {result.peorROI.toFixed(1)}%
          </p>
          <p className="mt-2 text-xs">Mes {result.peorMes}; caída máxima contra tus aportes.</p>
        </article>

        <article className="rounded-lg bg-[var(--green-soft)] p-4 text-[var(--green-text)]">
          <p className="text-xs">Vuelve a verde</p>
          <p className="mt-2 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums">
            {recoveryLabel}
          </p>
          <p className="mt-2 text-xs">{recoveryDetail}</p>
        </article>

        <article className="rounded-lg bg-[var(--bg-subtle)] p-4">
          <p className="text-xs text-[var(--text-secondary)]">Valor al recuperar</p>
          <p className="mt-2 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums text-[var(--text-primary)]">
            {breakEvenValue === null ? '—' : `$${fmt(breakEvenValue)}`}
          </p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            {breakEvenValue === null || breakEvenInvested === null
              ? 'Todavía no cruza la línea de aportes.'
              : `Ya cubre $${fmt(breakEvenInvested)} invertidos.`}
          </p>
        </article>

        <article className="rounded-lg bg-[var(--amber-soft)] p-4 text-[var(--amber-text)]">
          <p className="text-xs">Por qué el año 1 sale rojo</p>
          <p className="mt-2 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums">
            {firstYear.roi >= 0 ? '+' : ''}
            {firstYear.roi.toFixed(1)}%
          </p>
          <p className="mt-2 text-xs">
            Porque el modelo compra durante una caída temprana; eso es sano para DCA si no vendes.
          </p>
        </article>
      </div>
    </section>
  );
};
