export interface UserEntity {
  _id?: string
  name: string
  email: string
  password: string
  token: string | null
  confirmed: boolean
}

export interface UserRequestEntity {
  _id?: string
  name: string
  email: string
  password: string
}

export interface UserLogInReq {
  email: string
  password: string
}

export interface UserRegisterReq {
  name: string
  email: string
  password: string
  terms: boolean
}

export interface UserRegisterRes {
  _id?: string
  name?: string
  email?: string
  token?: string | null
  message?: string
  warning?: string
  resendVerificationLink?: boolean
}

export interface UserMeRes {
  id?: string
  email?: string
}

export type UserLoginRes = UserRegisterRes;

export type UserResetPasswordReq = Omit<UserLogInReq, 'password'>