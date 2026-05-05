'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { registerChartPlugins } from './ChartPlugins';
import { fmt, getPhase } from '@/lib/format';
import type { SimulationResult } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
registerChartPlugins();

interface PortfolioChartProps {
  result: SimulationResult;
}

const usePrefersDark = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDark(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isDark;
};

export const PortfolioChart = ({ result }: PortfolioChartProps) => {
  const chartRef = useRef<ChartJS<'line'> | null>(null);
  const isDark = usePrefersDark();
  const labels = useMemo(() => Array.from({ length: 120 }, (_, index) => String(index + 1)), []);

  const data = useMemo<ChartData<'line', number[], string>>(
    () => ({
      labels,
      datasets: [
        {
          label: 'Valor cartera',
          data: result.valores,
          borderColor: '#1A73E8',
          backgroundColor: isDark ? 'rgba(138, 180, 248, 0.16)' : 'rgba(26, 115, 232, 0.12)',
          borderWidth: 2,
          fill: { target: 1 },
          tension: 0.35,
          pointRadius: 0,
          pointHitRadius: 14,
        },
        {
          label: 'Aporte acumulado',
          data: result.aportesAcum,
          borderColor: isDark ? '#9AA0A6' : '#80868B',
          borderDash: [5, 4],
          borderWidth: 1.5,
          fill: false,
          tension: 0.2,
          pointRadius: 0,
          pointHitRadius: 14,
        },
      ],
    }),
    [isDark, labels, result.aportesAcum, result.valores],
  );

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 250,
      },
      layout: {
        padding: {
          top: 24,
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            autoSkip: false,
            color: isDark ? '#9AA0A6' : '#80868B',
            font: {
              size: 11,
              weight: 400,
            },
            maxRotation: 0,
            callback: (_value, index) => ((index + 1) % 12 === 0 ? `A${(index + 1) / 12}` : ''),
          },
        },
        y: {
          border: {
            display: false,
          },
          grid: {
            color: isDark ? 'rgba(232, 234, 237, 0.12)' : '#F1F3F4',
          },
          ticks: {
            color: isDark ? '#9AA0A6' : '#80868B',
            font: {
              size: 11,
              weight: 400,
            },
            callback: (value) => `$${Math.round(Number(value) / 1000)}K`,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
          borderColor: isDark ? '#3C3C3C' : '#DADCE0',
          borderWidth: 1,
          titleColor: isDark ? '#E8EAED' : '#202124',
          bodyColor: isDark ? '#E8EAED' : '#202124',
          bodyFont: {
            size: 12,
            weight: 400,
          },
          titleFont: {
            size: 12,
            weight: 500,
          },
          displayColors: false,
          callbacks: {
            title: (items) => {
              const month = items[0].dataIndex + 1;
              return `Mes ${month} · Año ${Math.ceil(month / 12)} · ${getPhase(month)}`;
            },
            label: (item) => {
              const month = item.dataIndex + 1;
              const value = result.valores[item.dataIndex];
              const invested = result.aportesAcum[item.dataIndex];
              const roi = invested > 0 ? ((value - invested) / invested) * 100 : 0;
              const futureLoss = result.valorFinal - value;
              const signed = `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;

              if (item.datasetIndex === 0) {
                const lines = [`Valor cartera: $${fmt(value)}`, `Si vendes aquí: ${signed}`];
                if (month < 120 && futureLoss > 0) {
                  lines.push(`Te perderías $${fmt(futureLoss)} futuros`);
                }
                return lines;
              }

              return `Aporte acumulado: $${fmt(invested)}`;
            },
          },
        },
        phasePlugin: {
          dark: isDark,
        },
        annotationsPlugin: {
          worstMonth: result.peorMes,
          breakEvenMonth: result.breakEvenMes,
          dark: isDark,
        },
      },
    }),
    [isDark, result.aportesAcum, result.breakEvenMes, result.peorMes, result.valores, result.valorFinal],
  );

  useEffect(() => {
    chartRef.current?.update('none');
  }, [data, options]);

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-[var(--bg)]">
      <div className="mb-4">
        <h2 className="text-sm font-medium tracking-[-0.01em] text-[var(--text-primary)]">
          Evolución de cartera
        </h2>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Valor estimado frente a tus aportes acumulados.
        </p>
      </div>
      <div className="h-[340px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--red-soft)] px-2.5 py-1 text-[var(--red-text)]">
          <span className="h-2 w-2 rounded-full bg-[#D93025]" /> Caída
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--amber-soft)] px-2.5 py-1 text-[var(--amber-text)]">
          <span className="h-2 w-2 rounded-full bg-[#F9AB00]" /> Recuperación
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-soft)] px-2.5 py-1 text-[var(--green-text)]">
          <span className="h-2 w-2 rounded-full bg-[#1E8E3E]" /> Crecimiento
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-subtle)] px-2.5 py-1">
          <span className="h-0 w-5 border-t border-dashed border-[#D93025]" /> Peor mes
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-subtle)] px-2.5 py-1">
          <span className="h-0 w-5 border-t border-dashed border-[#1E8E3E]" /> Mes en verde
        </span>
      </div>
    </section>
  );
};
