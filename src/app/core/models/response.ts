export interface Response<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}
