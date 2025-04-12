export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
  }
  
  export interface PaginatedResponse<T> {
    statusCode: number;
    message: string;
    data: {
      result: T[];
      total: number;
      page: number;
      pageSize: number;
    };
  }
  