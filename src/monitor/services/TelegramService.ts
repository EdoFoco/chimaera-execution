// import https from 'https';
import { TelegramConfig } from '../../config/TelegramConfig';
import { Inject, Service } from 'typedi';
import TelegramBot from 'node-telegram-bot-api';

@Service()
export default class TelegramService {
  private readonly config: TelegramConfig;
  private readonly bot: TelegramBot;

  constructor(@Inject("telegramConfig") config: TelegramConfig) {
    this.config = config;
    this.bot = new TelegramBot(config.apiKey, { polling: false });
  }

  public send = async (text: string): Promise<boolean> => {
    await this.bot.sendMessage(this.config.chatId, text, {
        parse_mode: 'HTML'
    });
    return true;
  };

//   private request<T extends Record<string, any>>(
//     path: string,
//     data?: Record<string, any>
//   ): Promise<{ ok: boolean } & Partial<T>> {
//     return new Promise((resolve, reject) => {
//       const req = https
//         .request(
//           `${this.config.apiUrl}/bot${this.config.apiKey}/${path}`,
//           {
//             method: 'POST',
//             headers: {
//               'content-type': 'application/json',
//             },
//           },
//           (res) => {
//             let result = '';

//             res
//               .setEncoding('utf-8')
//               .on('data', (chunk) => {
//                 result += chunk;
//               })
//               .on('end', () => {
//                 resolve(JSON.parse(result));
//               });
//           }
//         )
//         .on('error', (e) => {
//           console.log(e);
//           reject(e);
//         });

//       if (data) {
//         req.write(JSON.stringify(data));
//       }

//       req.end();
//     });
//   }
}
