import { Request } from "express";

interface AuthRequest extends Request {
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const getUser = (request: Request) => {
  const user = (request as AuthRequest).user;
  return user;
};

export default getUser;
