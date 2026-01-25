/**
 * API Request and Response Types
 */

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface ListParams {
  page?: number
  limit?: number
  sort?: string
  where?: Record<string, any>
  depth?: number
  select?: Record<string, boolean>
  locale?: string
}

export interface CreateParams<T> {
  data: T
}

export interface UpdateParams<T> {
  data: T
}

export interface DeleteParams {
  id: string | number
}

export interface AuthPayload {
  email: string
  password: string
}

export interface RegisterPayload extends AuthPayload {
  firstName: string
  lastName: string
  phone?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name?: string
    roles?: string[]
    createdAt: string
    updatedAt: string
  }
  token: string
}

export interface CurrentUserResponse {
  user: {
    id: string
    email: string
    name?: string
    roles?: string[]
    createdAt: string
    updatedAt: string
  }
}
