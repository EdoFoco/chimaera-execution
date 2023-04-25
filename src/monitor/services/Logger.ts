import { Service } from 'typedi';

@Service()
export class Logger {
  info(message: string){ console.log(message);}
}