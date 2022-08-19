import jwt, { JwtPayload } from "jsonwebtoken";
import process from "process";

export interface tokenEntity extends JwtPayload {
  id: string;
}

// Generate JWT
export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: '30d'
  })
}

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REF_TOKEN_KEY)
}

// verify JWT
export const verifyToken = (jwtCookie) => {
  let encryptToken = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_KEY) as tokenEntity;
  const id = encryptToken.id;
  if (!id) {
    return null
  }
  return id
}