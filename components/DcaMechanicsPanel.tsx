import { cspxPath, SP500_ALLOC, SP500_FEE_USD } from '@/lib/prices';

interface DcaMechanicsPanelProps {
  aporte: number;
}

export const DcaMechanicsPanel = ({ aporte }: DcaMechanicsPanelProps) => {
  const netCspx = aporte * SP500_ALLOC - SP500_FEE_USD;
  const usableCspx = Math.max(0, netCspx);
  const bottomPrice = cspxPath[9];
  const finalPrice = cspxPath[120];
  const bottomUnits = usableCspx > 0 ? usableCspx / bottomPrice : 0;
  const peakUnits = usableCspx > 0 ? usableCspx / finalPrice : 0;
  const ratio = peakUnits > 0 ? bottomUnits / peakUnits : null;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-[var(--bg)]">
      <div>
        <h2 className="text-sm font-medium tracking-[-0.01em] text-[var(--text-primary)]">
          Por qué los crashes son oportunidad
        </h2>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          El mismo dinero compra más unidades cuando el precio cae.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <article className="rounded-lg bg-[var(--bg-subtle)] p-4">
          <p className="text-xs text-[var(--text-secondary)]">En el fondo del crash · Mes 9 · CSPX a $480</p>
          <p className="mt-3 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums text-[var(--text-primary)]">
            {bottomUnits.toFixed(3)}
          </p>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">acciones por compra mensual</p>
        </article>
        <article className="rounded-lg bg-[var(--bg-subtle)] p-4">
          <p className="text-xs text-[var(--text-secondary)]">En el pico final · Mes 120 · CSPX a $1,707</p>
          <p className="mt-3 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums text-[var(--text-primary)]">
            {peakUnits.toFixed(3)}
          </p>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">acciones por compra mensual</p>
        </article>
        <article className="rounded-lg bg-[var(--blue-soft)] p-4 text-[var(--blue-text)]">
          <p className="text-xs">El descuento del miedo · Compra del fondo</p>
          <p className="mt-3 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums">
            {ratio === null ? '—' : `${ratio.toFixed(1)}×`}
          </p>
          <p className="mt-3 text-xs">más unidades por dólar</p>
        </article>
      </div>
    </section>
  );
};
