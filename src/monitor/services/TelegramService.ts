import https from 'https';
import { TelegramConfig } from '../../config/TelegramConfig';
import { Inject, Service } from 'typedi';

@Service()
export default class TelegramService {
  private readonly config: TelegramConfig;

  constructor(@Inject("telegramConfig") config: TelegramConfig) {
    this.config = config;
  }

  public send = async (text: string): Promise<boolean> => {
    const resp = await this.request('sendMessage', {
      chat_id: this.config.chatId,
      text: text,
    });

    return resp.ok;
  };

  private request<T extends Record<string, any>>(
    path: string,
    data?: Record<string, any>
  ): Promise<{ ok: boolean } & Partial<T>> {
    return new Promise((resolve, reject) => {
      const req = https
        .request(
          `${this.config.apiUrl}/bot${this.config.apiKey}/${path}`,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
          },
          (res) => {
            let result = '';

            res
              .setEncoding('utf-8')
              .on('data', (chunk) => {
                result += chunk;
              })
              .on('end', () => {
                resolve(JSON.parse(result));
              });
          }
        )
        .on('error', (e) => {
          console.log(e);
          reject(e);
        });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }
}
