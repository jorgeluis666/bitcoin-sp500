import { BTC_ALLOC, BTC_SPREAD, btcPath, cspxPath, FX_PEN_USD, SP500_ALLOC, SP500_FEE_USD, WISE_FEE } from './prices';
import type { SimulationResult, YearROI } from './types';

const MAX_YEARS = 10;
const MONTHS_PER_YEAR = 12;

const initialTranche = (month: number, capitalUSD: number): number => {
  if (month === 1) return capitalUSD * 0.5;
  if (month === 3) return capitalUSD * 0.3;
  if (month === 6) return capitalUSD * 0.2;
  return 0;
};

export const simulate = (aporteMensual: number, capitalSoles: number, years = MAX_YEARS): SimulationResult => {
  const clampedYears = Math.min(MAX_YEARS, Math.max(1, Math.round(years)));
  const months = clampedYears * MONTHS_PER_YEAR;
  const capitalUSD = (capitalSoles / FX_PEN_USD) * (1 - WISE_FEE);
  const valores: number[] = [];
  const aportesAcum: number[] = [];
  const rois: number[] = [];
  const yearROI: YearROI[] = [];

  let cspxShares = 0;
  let btcAmount = 0;
  let aporteAcum = 0;
  let worstROI = Number.POSITIVE_INFINITY;
  let worstMonth = 1;

  for (let month = 1; month <= months; month += 1) {
    const tranche = initialTranche(month, capitalUSD);
    const amount = aporteMensual + tranche;
    aporteAcum += amount;

    const cspxInvestment = Math.max(0, amount * SP500_ALLOC - SP500_FEE_USD);
    const btcInvestment = amount * BTC_ALLOC * (1 - BTC_SPREAD);

    cspxShares += cspxInvestment / cspxPath[month];
    btcAmount += btcInvestment / btcPath[month];

    const value = cspxShares * cspxPath[month] + btcAmount * btcPath[month];
    const roi = aporteAcum > 0 ? ((value - aporteAcum) / aporteAcum) * 100 : 0;

    valores.push(value);
    aportesAcum.push(aporteAcum);
    rois.push(roi);

    if (aporteAcum > 0 && roi < worstROI) {
      worstROI = roi;
      worstMonth = month;
    }

    if (month % MONTHS_PER_YEAR === 0) {
      const year = month / MONTHS_PER_YEAR;
      yearROI.push({
        year,
        aporte: aporteAcum,
        valor: value,
        roi,
      });
    }
  }

  const best = yearROI.reduce((currentBest, item) => (item.roi > currentBest.roi ? item : currentBest), yearROI[0]);
  const worst = yearROI.reduce((currentWorst, item) => (item.roi < currentWorst.roi ? item : currentWorst), yearROI[0]);
  const breakEvenMes = worstROI < 0
    ? rois.findIndex((roi, index) => index >= worstMonth && roi >= 0) + 1
    : 0;
  const resolvedBreakEvenMes = breakEvenMes > 0 ? breakEvenMes : null;
  const valorFinal = valores[valores.length - 1];
  const aportesMensualesTotal = aporteMensual * months;
  const totalInvertido = capitalUSD + aportesMensualesTotal;

  return {
    valores,
    aportesAcum,
    years: clampedYears,
    months,
    totalInvertido,
    valorFinal,
    ganancia: valorFinal - totalInvertido,
    peorROI: worstROI,
    peorMes: worstMonth,
    breakEvenMes: resolvedBreakEvenMes,
    recoveryMonths: resolvedBreakEvenMes === null ? null : resolvedBreakEvenMes - worstMonth,
    yearROI,
    capitalUSD,
    aportesMensualesTotal,
    aporteMensual,
    bestYear: best.year,
    worstYear: worst.year,
  };
};
