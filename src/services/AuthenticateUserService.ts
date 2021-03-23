import { compare } from 'bcryptjs';
import {getRepository} from 'typeorm';
import User from '../models/User';

interface Request {
  email: string,
  password: string,
}

interface Response {
  user: User
}

class AuthenticateUserService {
  public async execute({email, password}: Request): Promise<Response>{
   const usersRepository = getRepository(User);
   const user = await usersRepository.findOne({ where: { email } });

   if(!user){
     throw new Error('Incorrect combination email/password');
   }

   const matchedPassword = await compare(password, user.password);

   if(!matchedPassword){
     throw new Error('Incorrect combination email/password');
   }

   return {
     user
   }
  }
}

export default AuthenticateUserService;