import { fmt } from '@/lib/format';
import type { SimulationResult } from '@/lib/types';

interface AbandonmentPanelProps {
  result: SimulationResult;
}

export const AbandonmentPanel = ({ result }: AbandonmentPanelProps) => {
  const worstValue = result.valores[result.peorMes - 1];
  const recoveryValue = result.valores[23];
  const cards = [
    {
      label: 'Vendes en el peor momento',
      month: `Mes ${result.peorMes}`,
      value: worstValue,
      footer: `Te pierdes $${fmt(result.valorFinal - worstValue)} futuros`,
      className: 'bg-[var(--red-soft)] text-[var(--red-text)]',
    },
    {
      label: 'Vendes tras la recuperación',
      month: 'Mes 24',
      value: recoveryValue,
      footer: `Te pierdes $${fmt(result.valorFinal - recoveryValue)} futuros`,
      className: 'bg-[var(--amber-soft)] text-[var(--amber-text)]',
    },
    {
      label: 'Aguantas los 10 años',
      month: 'Mes 120',
      value: result.valorFinal,
      footer: 'Disciplina recompensada',
      className: 'bg-[var(--green-soft)] text-[var(--green-text)]',
    },
  ];

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-[var(--bg)]">
      <div>
        <h2 className="text-sm font-medium tracking-[-0.01em] text-[var(--text-primary)]">
          Si te asustas y vendes...
        </h2>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          El costo concreto de abandonar en cada momento.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-lg p-4 ${card.className}`}>
            <p className="text-xs">{card.label}</p>
            <p className="mt-1 text-xs">{card.month}</p>
            <p className="mt-3 text-[22px] font-medium leading-none tracking-[-0.01em] tabular-nums">
              ${fmt(card.value)}
            </p>
            <p className="mt-3 text-xs">{card.footer}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
