export type PaginationResponse<T> = {
  data: T[];
  total: number;
  skip: number;
  limit: number;
};
