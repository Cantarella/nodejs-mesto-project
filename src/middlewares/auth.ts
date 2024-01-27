import { Request, NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Error401 from '../helpers/errors/Error401';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export default function checkAuthorization(req: SessionRequest, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.send(new Error401('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.send(new Error401('Необходима авторизация'));
  }
  req.user = payload;
  next();
}
