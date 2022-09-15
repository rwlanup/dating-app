export const mergeClasses = (...classNames: (string | undefined | null | number | boolean)[]): string | undefined => {
  let className: string | undefined;
  classNames.forEach((currentName) => {
    if (currentName || typeof currentName === 'number') {
      className = className ? `${className} ${currentName}` : `${currentName}`;
    }
  });
  return className;
};
