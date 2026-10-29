/** Formate des points (jusqu'à 2 décimales, virgule française). */
export function formatPoints(p: number): string {
  const arrondi = Math.round(p * 100) / 100;
  return Number.isInteger(arrondi) ? String(arrondi) : arrondi.toFixed(2).replace(/0$/, '').replace('.', ',');
}
