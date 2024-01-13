import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('api/storage')
export class StorageController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/report_excel/:name')
  getFileAndDelete(@Param('name') fileName: string, @Res() res: Response) {
    const pathName = 'temp/' + fileName;

    try {
      if (!fs.existsSync(pathName)) {
        throw new NotFoundException('File tidak ditemukan');
      }

      // Menggunakan res.download untuk mengirim file sebagai respons
      res.download(pathName, fileName, async (err: any) => {
        if (err) {
          console.error(err);
          res.status(err.status).end();
        } else {
          // Hapus file setelah dikirim sebagai respons
          try {
            await fs.promises.unlink(pathName);
            console.log(`File '${fileName}' telah dihapus.`);
          } catch (error) {
            console.error(`Gagal menghapus file '${fileName}':`, error);
          }
        }
      });
    } catch (error) {
      return {
        status: 500,
        error: 'Error: ' + error,
      };
    }
  }

  @Get('/badge/:badge')
  async getBadge(@Param('badge') badge: string, @Res() response: Response) {
    try {
      const dataResp = await this.client
        .send('badgeShowSystem', badge)
        .toPromise();

      if (!dataResp || !dataResp.value) {
        // Handle gambar tidak ditemukan
        response.status(404).send('Gambar tidak ditemukan');
        return;
      }

      const imageBuffer = dataResp.value;

      const buffer = Buffer.from(imageBuffer.data);

      fs.writeFileSync('temp/file_output.png', buffer);

      response.sendfile('temp/file_output.png');
    } catch (error) {
      // Handle kesalahan lainnya
      response.status(500).send('Terjadi kesalahan');
    }
  }

  @Get('/statistics/:name')
  getFileAndDeleteStatistics(
    @Param('name') fileName: string,
    @Res() res: Response,
  ) {
    const pathName = 'temp/' + fileName;

    try {
      if (!fs.existsSync(pathName)) {
        throw new NotFoundException('File tidak ditemukan');
      }

      // Menggunakan res.download untuk mengirim file sebagai respons
      res.download(pathName, fileName, async (err: any) => {
        if (err) {
          console.error(err);
          res.status(err.status).end();
        } else {
          // Hapus file setelah dikirim sebagai respons
          try {
            await fs.promises.unlink(pathName);
            console.log(`File '${fileName}' telah dihapus.`);
          } catch (error) {
            console.error(`Gagal menghapus file '${fileName}':`, error);
          }
        }
      });
    } catch (error) {
      return {
        status: 500,
        error: 'Error: ' + error,
      };
    }
  }
}
