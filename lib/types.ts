export interface YearROI {
  year: number;
  aporte: number;
  valor: number;
  roi: number;
}

export interface SimulationResult {
  valores: number[];
  aportesAcum: number[];
  totalInvertido: number;
  valorFinal: number;
  ganancia: number;
  peorROI: number;
  peorMes: number;
  breakEvenMes: number | null;
  yearROI: YearROI[];
  capitalUSD: number;
  aportesMensualesTotal: number;
  aporteMensual: number;
  bestYear: number;
  worstYear: number;
}
