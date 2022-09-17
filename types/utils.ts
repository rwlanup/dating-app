type SimplifyObjs<Obj1, Obj2> = {
  [K in keyof (Obj1 & Obj2)]: K extends keyof Obj2 ? Obj2[K] : K extends keyof Obj1 ? Obj1[K] : never;
};

export type PartialByKeys<T, K extends keyof T = keyof T> = SimplifyObjs<
  {
    [P in keyof T as P extends K ? P : never]?: T[P];
  },
  {
    [P in keyof T as P extends K ? never : P]: T[P];
  }
>;

export type RequiredByKeys<T, K extends keyof T = keyof T> = SimplifyObjs<
  {
    [P in keyof T as P extends K ? P : never]-?: T[P];
  },
  {
    [P in keyof T as P extends K ? never : P]: T[P];
  }
>;

export type OnlyRequiredByKeys<T, K extends keyof T> = RequiredByKeys<
  PartialByKeys<T>,
  Extract<keyof PartialByKeys<T>, K>
>;

export type NullPartial<T, K extends keyof T = keyof T> = SimplifyObjs<
  {
    [P in keyof T as P extends K ? P : never]?: T[P] | null;
  },
  {
    [P in keyof T as P extends K ? never : P]: T[P];
  }
>;
