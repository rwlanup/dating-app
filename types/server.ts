export type DataWithSuccessMessage<Data extends object = {}> = {
  status: number;
  message: string;
} & Data;

export type PaginatedResult<T> = {
  items: T[];
  nextCursor?: string;
};
