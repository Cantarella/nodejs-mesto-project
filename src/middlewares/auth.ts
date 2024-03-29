import { Request, NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Error401 from '../helpers/errors/Error401';

export interface SessionRequest extends Request {
  user?: {id: string} | JwtPayload;
}

export function checkAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .send(new Error401('необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .send(new Error401('Необходима авторизация'));
  }
  //@ts-ignore
  req.user = payload;
  next();
}
