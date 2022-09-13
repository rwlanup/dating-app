export type DataWithSuccessMessage<Data extends object = {}> = {
  status: number;
  message: string;
} & Data;
