export const parseTime = (time: string): number => {
  const [hr, min] = time.split(':');

  return +hr + +(+min / 60).toFixed(2);
};
