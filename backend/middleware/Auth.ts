import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()
import { Response, Request, NextFunction } from 'express';
export const SECRET = process.env.SECRET;  
export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET as string , (err,user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if(!user){
        return res.status(403)
      }
      if(typeof user === "string"){
        return res.status(403)
      }
      
      req.headers['userId'] = user.id;
      req.headers['role']=user.role
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


