import { Chart, type ChartType, type Plugin } from 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    phasePlugin?: {
      dark?: boolean;
    };
    annotationsPlugin?: {
      worstMonth: number;
      breakEvenMonth: number | null;
      dark?: boolean;
    };
  }
}

const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const drawBand = (
  chart: Chart,
  startIndex: number,
  endIndex: number,
  color: string,
) => {
  const { ctx, chartArea, scales } = chart;
  const xScale = scales.x;
  if (!xScale) return;

  const leftBoundary = startIndex <= 0
    ? chartArea.left
    : (xScale.getPixelForValue(startIndex - 1) + xScale.getPixelForValue(startIndex)) / 2;
  const rightBoundary = endIndex >= 119
    ? chartArea.right
    : (xScale.getPixelForValue(endIndex) + xScale.getPixelForValue(endIndex + 1)) / 2;

  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(leftBoundary, chartArea.top, rightBoundary - leftBoundary, chartArea.bottom - chartArea.top);
  ctx.restore();
};

export const phasePlugin: Plugin<'line'> = {
  id: 'phasePlugin',
  beforeDatasetsDraw(chart, _args, options) {
    const dark = options.dark === true;
    drawBand(chart, 0, 8, dark ? 'rgba(242, 139, 130, 0.12)' : 'rgba(217, 48, 37, 0.06)');
    drawBand(chart, 9, 23, dark ? 'rgba(253, 214, 99, 0.12)' : 'rgba(249, 171, 0, 0.07)');
    drawBand(chart, 24, 119, dark ? 'rgba(129, 201, 149, 0.1)' : 'rgba(30, 142, 62, 0.05)');
  },
};

const drawAnnotation = (
  chart: Chart,
  month: number,
  label: string,
  color: string,
  dashed: boolean,
) => {
  const { ctx, chartArea, scales } = chart;
  const xScale = scales.x;
  if (!xScale || month < 1 || month > 120) return;

  const x = xScale.getPixelForValue(month - 1);
  const y = chartArea.top;
  const labelHeight = 20;
  const paddingX = 8;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash(dashed ? [4, 4] : []);
  ctx.beginPath();
  ctx.moveTo(x, chartArea.top);
  ctx.lineTo(x, chartArea.bottom);
  ctx.stroke();

  ctx.font = '500 11px Inter, sans-serif';
  const labelWidth = ctx.measureText(label).width + paddingX * 2;
  const labelX = Math.min(
    Math.max(x - labelWidth / 2, chartArea.left + 2),
    chartArea.right - labelWidth - 2,
  );

  roundedRect(ctx, labelX, y - labelHeight - 4, labelWidth, labelHeight, 6);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, labelX + paddingX, y - labelHeight / 2 - 4);
  ctx.restore();
};

export const annotationsPlugin: Plugin<'line'> = {
  id: 'annotationsPlugin',
  afterDatasetsDraw(chart, _args, options) {
    drawAnnotation(chart, options.worstMonth, `Peor mes ${options.worstMonth}`, '#D93025', true);
    if (options.breakEvenMonth !== null) {
      drawAnnotation(chart, options.breakEvenMonth, `Verde mes ${options.breakEvenMonth}`, '#1E8E3E', true);
    }
  },
};

let registered = false;

export const registerChartPlugins = () => {
  if (registered) return;
  Chart.register(phasePlugin, annotationsPlugin);
  registered = true;
};
