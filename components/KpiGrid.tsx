import { fmt } from '@/lib/format';
import type { SimulationResult } from '@/lib/types';

interface KpiGridProps {
  result: SimulationResult;
}

export const KpiGrid = ({ result }: KpiGridProps) => {
  const finalLabel = result.years === 1 ? 'Valor año 1' : `Valor año ${result.years}`;
  const gainIsPositive = result.ganancia >= 0;
  const cards = [
    {
      label: 'Total que invertirás',
      value: `$${fmt(result.totalInvertido)}`,
      sublabel: `Capital + ${result.months} aportes`,
      explanation: 'Es tu esfuerzo real; sirve como base para medir si el plan creó valor.',
      className: 'bg-[var(--bg-subtle)] text-[var(--text-primary)]',
      labelClass: 'text-[var(--text-secondary)]',
    },
    {
      label: finalLabel,
      value: `$${fmt(result.valorFinal)}`,
      sublabel: 'Lo que tendrías si no vendes antes',
      explanation: 'Resume el efecto conjunto de aportes, precios, comisiones y disciplina.',
      className: 'bg-[var(--bg-subtle)] text-[var(--text-primary)]',
      labelClass: 'text-[var(--text-secondary)]',
    },
    {
      label: gainIsPositive ? 'Ganancia neta' : 'Pérdida temporal',
      value: `${gainIsPositive ? '+' : '-'}$${fmt(Math.abs(result.ganancia))}`,
      sublabel: gainIsPositive ? 'Diferencia a tu favor' : 'Diferencia contra lo invertido',
      explanation: 'Mide cuánto cambia tu patrimonio frente al dinero que pusiste.',
      className: gainIsPositive
        ? 'bg-[var(--green-soft)] text-[var(--green-text)]'
        : 'bg-[var(--red-soft)] text-[var(--red-text)]',
      labelClass: gainIsPositive ? 'text-[var(--green-text)]' : 'text-[var(--red-text)]',
    },
    {
      label: 'Peor momento',
      value: `${result.peorROI.toFixed(1)}%`,
      sublabel: `Mes ${result.peorMes}`,
      explanation: 'Está aquí para medir tolerancia: cuánto rojo tendrías que aguantar.',
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
          <p className={`mt-3 text-[11px] leading-4 ${card.labelClass}`}>{card.explanation}</p>
        </article>
      ))}
    </section>
  );
};
