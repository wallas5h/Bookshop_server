export interface UserEntity {
  _id?: string
  name: string
  email: string
  password: string
  token: string | null
}

export interface UserRequestEntity {
  _id?: string
  name: string
  email: string
  password: string
}