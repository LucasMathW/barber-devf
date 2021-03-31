import { compare } from 'bcryptjs';
import {getRepository} from 'typeorm';
import User from '../models/User';
import {sign} from 'jsonwebtoken';
interface Request {
  email: string,
  password: string,
}
interface Response {
  user: User,
  token: string,
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

   const token = sign({}, '8f9b2fbd089d3b735019134a3b19e0ae', {
     subject: user.id,
     expiresIn: '1d'
   })

   return {
     user,
     token
   }
  }
}
export default AuthenticateUserService;
