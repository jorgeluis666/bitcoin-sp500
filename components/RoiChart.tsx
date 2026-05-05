'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import type { SimulationResult } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface RoiChartProps {
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

export const RoiChart = ({ result }: RoiChartProps) => {
  const chartRef = useRef<ChartJS<'bar'> | null>(null);
  const isDark = usePrefersDark();
  const labels = useMemo(() => result.yearROI.map((item) => `A${item.year}`), [result.yearROI]);

  const data = useMemo<ChartData<'bar', number[], string>>(
    () => ({
      labels,
      datasets: [
        {
          label: 'ROI',
          data: result.yearROI.map((item) => item.roi),
          backgroundColor: result.yearROI.map((item) => (item.roi < 0 ? '#D93025' : '#1A73E8')),
          borderRadius: 4,
          maxBarThickness: 36,
        },
      ],
    }),
    [labels, result.yearROI],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 250,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: isDark ? '#9AA0A6' : '#80868B',
            font: {
              size: 11,
              weight: 400,
            },
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
            callback: (value) => `${Number(value).toFixed(0)}%`,
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
          displayColors: false,
          callbacks: {
            label: (item) => {
              const roi = Number(item.raw);
              return `ROI: ${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
            },
          },
        },
      },
    }),
    [isDark],
  );

  useEffect(() => {
    chartRef.current?.update('none');
  }, [data, options]);

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-[var(--bg)]">
      <div className="mb-4">
        <h2 className="text-sm font-medium tracking-[-0.01em] text-[var(--text-primary)]">
          ROI por año
        </h2>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Retorno acumulado al cierre de cada año. Un año rojo al inicio muestra el costo de comprar durante caída, no una predicción de calendario.
        </p>
      </div>
      <div className="h-[220px]">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </section>
  );
};
