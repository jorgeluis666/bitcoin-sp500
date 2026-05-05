import { fmt } from '@/lib/format';
import type { SimulationResult } from '@/lib/types';

interface KpiGridProps {
  result: SimulationResult;
}

export const KpiGrid = ({ result }: KpiGridProps) => {
  const cards = [
    {
      label: 'Total que invertirás',
      value: `$${fmt(result.totalInvertido)}`,
      sublabel: 'Capital + 120 aportes',
      className: 'bg-[var(--bg-subtle)] text-[var(--text-primary)]',
      labelClass: 'text-[var(--text-secondary)]',
    },
    {
      label: 'Valor año 10',
      value: `$${fmt(result.valorFinal)}`,
      sublabel: 'Lo que tendrás al final',
      className: 'bg-[var(--bg-subtle)] text-[var(--text-primary)]',
      labelClass: 'text-[var(--text-secondary)]',
    },
    {
      label: 'Ganancia neta',
      value: `+$${fmt(Math.max(0, result.ganancia))}`,
      sublabel: 'Magia del compuesto',
      className: 'bg-[var(--green-soft)] text-[var(--green-text)]',
      labelClass: 'text-[var(--green-text)]',
    },
    {
      label: 'Peor momento',
      value: `${result.peorROI.toFixed(1)}%`,
      sublabel: 'Lo que tendrás que aguantar',
      className: 'bg-[var(--red-soft)] text-[var(--red-text)]',
      labelClass: 'text-[var(--red-text)]',
    },
  ];

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      {cards.map((card) => (
        <article key={card.label} className={`rounded-lg p-4 ${card.className}`}>
          <p className={`text-xs ${card.labelClass}`}>{card.label}</p>
          <p className="mt-2 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums">
            {card.value}
          </p>
          <p className={`mt-2 text-xs ${card.labelClass}`}>{card.sublabel}</p>
        </article>
      ))}
    </section>
  );
};
