export interface ApiResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}
