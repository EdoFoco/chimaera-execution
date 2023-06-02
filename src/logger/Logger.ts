// import chalk from 'chalk';
import { Service } from 'typedi';

@Service()
export class Logger {
    debug(args: any){console.log(`[${new Date().toLocaleString()}] [DEBUG]`, args)};
    info(args: any){console.log(`[${new Date().toLocaleString()}] [INFO]`, args)};
    warning(args: any){console.log(`[${new Date().toLocaleString()}] [WARN]`, args)};
    error(args: any){console.log(`[${new Date().toLocaleString()}] [ERROR]`, args)};
}