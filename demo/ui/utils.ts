export const timeToNumber = (time: string) => {
  const first = parseInt(time.split(':')[0]);
  const second = (+parseInt(time.split(':')[1]) / 60) * 100;
  const output = parseInt(`${first}.${second}`);

  return output;
};

export const normalizeString = (string: string[]) => {
  const data = string.map(data => {
    if (Array.isArray(data)) {
      return `${data.length} days`;
    }
    return data;
  });

  return data;
};
