export const fmt = (n: number): string => Math.round(n).toLocaleString('en-US');

export const getPhase = (month: number): 'Caída' | 'Recuperación' | 'Crecimiento' => {
  if (month <= 9) return 'Caída';
  if (month <= 24) return 'Recuperación';
  return 'Crecimiento';
};
