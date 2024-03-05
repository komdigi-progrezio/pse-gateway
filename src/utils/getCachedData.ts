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

  async account(token: string): Promise<any> {
    const decoded = await this.getDecodedToken(token);
    const email = decoded.email;

    let cacheData = await this.cacheService.get(token);

    if (!cacheData) {
      const ssoData = await this.fetchDataFromSso(token, email);
      const userData = await this.client.send('authUser', email).toPromise();

      if (ssoData && userData && userData.data && userData.data.status == 1) {
        cacheData = userData || null;
        this.cacheData(token, cacheData, ssoData.exp).then(() => {
          this.account(token);
        });
      }else{
        return {
          status:401,
          message:"Login tidak berhasil, silahkan hubungi admin"
        };
      }
    }
    return cacheData;
  }

  private async fetchDataFromSso(token: string, email: string): Promise<any> {
    try {
      //admin/realms/SPBE/users
      const url = `${process.env.KEYCLOACK_DOMAIN}/realms/SPBE/protocol/openid-connect/userinfo`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          email: email,
        },
      });

      return response?.data || null;
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

  async clearCacheData(email: string) {
    await this.cacheService.del(email);
  }
}
