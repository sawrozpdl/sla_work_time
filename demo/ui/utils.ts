export const parseTime = (time: string) => {
  const first = parseInt(time.split(':')[0]);
  const second = (+parseInt(time.split(':')[1]) / 60) * 100;
  const output = parseInt(`${first}.${second}`);

  return output;
};
