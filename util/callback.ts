export const delay = (timeInMilliseconds: number, callback: Function): ReturnType<typeof setTimeout> => {
  return setTimeout(() => {
    callback();
  }, timeInMilliseconds);
};

export const times = <Return>(time: number, callback: (item: number, index: number) => Return): Return[] => {
  return Array(time).fill(0).map(callback);
};

export const throttle = <Params extends unknown[], Returns>(callback: (...args: Params) => Returns, delay = 1000) => {
  let shouldWait = false;

  return (...args: Params) => {
    if (shouldWait) return;

    callback(...args);
    shouldWait = true;

    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
};
