import { fmt } from '@/lib/format';
import type { SimulationResult } from '@/lib/types';

interface AbandonmentPanelProps {
  result: SimulationResult;
}

export const AbandonmentPanel = ({ result }: AbandonmentPanelProps) => {
  const worstValue = result.valores[result.peorMes - 1];
  const recoveryMonth = result.breakEvenMes ?? Math.min(24, result.months);
  const recoveryValue = result.valores[recoveryMonth - 1];
  const finalText = result.years === 1 ? 'Aguantas 1 año' : `Aguantas ${result.years} años`;
  const futureLoss = (value: number) => Math.max(0, result.valorFinal - value);
  const cards = [
    {
      label: 'Vendes en el peor momento',
      month: `Mes ${result.peorMes}`,
      value: worstValue,
      footer: `Te pierdes $${fmt(futureLoss(worstValue))} futuros`,
      className: 'bg-[var(--red-soft)] text-[var(--red-text)]',
    },
    {
      label: result.breakEvenMes === null ? 'Vendes antes de recuperar' : 'Vendes al volver a verde',
      month: `Mes ${recoveryMonth}`,
      value: recoveryValue,
      footer: result.breakEvenMes === null
        ? 'Todavía estarías bajo tus aportes'
        : `Te pierdes $${fmt(futureLoss(recoveryValue))} futuros`,
      className: 'bg-[var(--amber-soft)] text-[var(--amber-text)]',
    },
    {
      label: finalText,
      month: `Mes ${result.months}`,
      value: result.valorFinal,
      footer: 'La disciplina captura la recuperación',
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
          Este panel traduce el miedo a dólares: cuánto cuesta salir antes de que el escenario se complete.
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
