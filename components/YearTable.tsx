import { fmt } from '@/lib/format';
import type { SimulationResult, YearROI } from '@/lib/types';

interface YearTableProps {
  result: SimulationResult;
}

const badgeForYear = (row: YearROI, result: SimulationResult) => {
  if (row.year === result.years) {
    return <span className="rounded-full bg-[var(--blue-soft)] px-2.5 py-1 text-xs font-medium text-[var(--blue-text)]">Final</span>;
  }

  if (row.year === result.bestYear) {
    return <span className="rounded-full bg-[var(--green-soft)] px-2.5 py-1 text-xs font-medium text-[var(--green-text)]">Mejor año</span>;
  }

  if (row.year === result.worstYear) {
    return <span className="rounded-full bg-[var(--red-soft)] px-2.5 py-1 text-xs font-medium text-[var(--red-text)]">Peor año</span>;
  }

  return <span className="text-xs text-[var(--text-tertiary)]">—</span>;
};

export const YearTable = ({ result }: YearTableProps) => (
  <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-[var(--bg)]">
    <div className="mb-4">
      <h2 className="text-sm font-medium tracking-[-0.01em] text-[var(--text-primary)]">
        Resumen año por año
      </h2>
      <p className="mt-1 text-[13px] leading-5 text-[var(--text-secondary)]">
        La tabla no dice que un año malo tenga que ocurrir; ordena un shock temprano y una recuperación para enseñar
        qué pasa si mantienes el DCA.
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left text-[10px] sm:text-xs">
        <thead>
          <tr className="bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
            <th className="w-[14%] border-b border-[var(--separator)] px-2 py-2 font-medium uppercase">Año</th>
            <th className="w-[24%] border-b border-[var(--separator)] px-2 py-2 font-medium uppercase">Aporte acum.</th>
            <th className="w-[25%] border-b border-[var(--separator)] px-2 py-2 font-medium uppercase">Valor cartera</th>
            <th className="w-[14%] border-b border-[var(--separator)] px-2 py-2 font-medium uppercase">ROI</th>
            <th className="w-[23%] border-b border-[var(--separator)] px-2 py-2 font-medium uppercase">Badge</th>
          </tr>
        </thead>
        <tbody>
          {result.yearROI.map((row) => {
            const isFinal = row.year === result.years;
            const roiColor = row.roi < 0
              ? 'text-[var(--red-text)]'
              : isFinal
                ? 'text-[var(--blue-text)]'
                : 'text-[var(--text-primary)]';

            return (
              <tr key={row.year} className={isFinal ? 'bg-[var(--blue-soft)] font-medium' : undefined}>
                <td className="border-b border-[var(--separator)] px-2 py-2 tabular-nums text-[var(--text-primary)]">
                  {row.year}
                </td>
                <td className="border-b border-[var(--separator)] px-2 py-2 tabular-nums text-[var(--text-primary)]">
                  ${fmt(row.aporte)}
                </td>
                <td className="border-b border-[var(--separator)] px-2 py-2 tabular-nums text-[var(--text-primary)]">
                  ${fmt(row.valor)}
                </td>
                <td className={`border-b border-[var(--separator)] px-2 py-2 tabular-nums ${roiColor}`}>
                  {row.roi >= 0 ? '+' : ''}
                  {row.roi.toFixed(1)}%
                </td>
                <td className="border-b border-[var(--separator)] px-2 py-2">{badgeForYear(row, result)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </section>
);
