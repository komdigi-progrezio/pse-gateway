import { CacheInterceptor } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Client,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import axios from 'axios';
import { Cache } from 'cache-manager';

@UseInterceptors(CacheInterceptor)
export class getCachedData {
  constructor(
    private jwtService: JwtService,
    private cacheService: Cache,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: +process.env.PSE_USER_SERVICE_PORT },
    });
  }

  private readonly client: ClientProxy;

  async getDecodedToken(token: any) {
    const decoded = await this.jwtService.decode(token);

    return decoded;
  }

  async account(token: string, email: string): Promise<any> {
    let cacheData = await this.cacheService.get(email);

    if (cacheData === undefined) {
      const ssoData = await this.fetchDataFromSso(token, email);

      const userData = await this.client.send('authUser', email).toPromise();

      if (userData && ssoData) {
        cacheData = userData || null;
        this.cacheData(email, cacheData, ssoData.exp).then(() => {
          this.account(token, email);
        });
      }
    }
    return cacheData;
  }

  private async fetchDataFromSso(token: string, email: string): Promise<any> {
    try {
      const url = `${process.env.KEYCLOACK_DOMAIN}/admin/realms/SPBE/users`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          email: email,
        },
      });

      return response?.data[0] || null;
    } catch (error) {
      console.log(error);
    }
  }

  async cacheData(
    email: string,
    data: any,
    keycloakExp: number,
  ): Promise<void> {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExp = keycloakExp - currentTime;

    await this.cacheService.set(email, data, timeUntilExp);
  }
}
