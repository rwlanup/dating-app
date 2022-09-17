export const delay = (timeInMilliseconds: number, callback: Function): ReturnType<typeof setTimeout> => {
  return setTimeout(() => {
    callback();
  }, timeInMilliseconds);
};

export const times = <Return>(time: number, callback: (item: number, index: number) => Return): Return[] => {
  return Array(time).fill(0).map(callback);
};
