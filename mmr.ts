export {};

declare global {
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number;
  }
}

const gainPercent = [0.5, 0.3, 0.15, 0.05];
const losePercent = [0.1, 0.07, 0.04, 0.01];

export function calculateMMRs(mmrs: number[]) {
  const avg = Math.round(mmrs.reduce((a, b) => a + b) / mmrs.length);
  const diff = mmrs.map((item) => item - avg);

  const sortedMMRs = [...mmrs].sort((a, b) => b - a);

  const edgeMMR = 2000;

  function gainMMR(rank: number) {
    if (rank >= gainPercent.length) {
      return 0;
    }

    if (diff[rank] < 0) {
      return Math.max(100, Math.abs(diff[rank])) * gainPercent[rank];
    }

    return (
      (1 - Math.min(edgeMMR, diff[rank]) / edgeMMR) * 100 * gainPercent[rank]
    );
  }

  function loseMMR(rank: number) {
    if (diff[rank] < 0) {
      return 0;
    }

    const index = diff.length - 1 - rank;

    if (index < losePercent.length) {
      return diff[rank] * losePercent[index];
    }

    return 0;
  }

  function bonusMMR(rank: number) {
    return (sortedMMRs.findLastIndex((val) => val === mmrs[rank]) - rank) * 10;
  }

  return mmrs.map(
    (mmr, rank) =>
      mmr + Math.round(gainMMR(rank) - loseMMR(rank) + bonusMMR(rank))
  );
}
