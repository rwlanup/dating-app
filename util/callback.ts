export const delay = (timeInMilliseconds: number, callback: Function): ReturnType<typeof setTimeout> => {
  return setTimeout(() => {
    callback();
  }, timeInMilliseconds);
};
