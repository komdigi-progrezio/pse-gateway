import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/storage')
export class StorageController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_MASTER_DATA_SERVICE_PORT },
  })
  private readonly clientMaster: ClientProxy;
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_USER_SERVICE_PORT },
  })
  private readonly clientUser: ClientProxy;

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
      console.log(dataResp.name);

      const filePath = path.join(__dirname, '../../temp', dataResp.name);

      console.log(filePath);

      fs.writeFile(filePath, buffer, (err: any) => {
        if (err) {
          console.error(err);
          throw new NotFoundException('File tidak ditemukan');
        } else {
          response.sendFile(filePath, async (err: any) => {
            if (err) {
              console.error(err);
              throw new NotFoundException('File tidak ditemukan');
            } else {
              // Hapus file setelah dikirim sebagai respons
              try {
                await fs.promises.unlink(filePath);
                console.log(`File '${dataResp.name}' telah dihapus.`);
              } catch (error) {
                console.error(
                  `Gagal menghapus file '${dataResp.name}':`,
                  error,
                );
              }
            }
          });
        }
      });
    } catch (error) {
      // Handle kesalahan lainnya
      console.error(error);
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

  @Get('/dokumen_sistem/:id/:document')
  async getDocumentSystem(@Param() data: any, @Res() response: Response) {
    try {
      const dataResp = await this.client
        .send('getDocumentSystem', data)
        .toPromise();
      if (!dataResp || !dataResp.value) {
        // Handle gambar tidak ditemukan
        response.status(404).send('Document tidak ditemukan');
        return;
      }

      const imageBuffer = dataResp.value;

      const buffer = Buffer.from(imageBuffer.data);

      // Set header respons untuk tipe konten PDF
      response.setHeader('Content-Type', 'application/pdf');

      // Set header responsepons untuk menentukan cara file akan ditampilkan oleh browser
      response.setHeader(
        'Content-Disposition',
        `inline; filename=${dataResp.name}`,
      );

      // Kirim buffer sebagai responsepons
      response.send(buffer);
    } catch (error) {
      // Handle kesalahan lainnya
      console.error(error);
      response.status(500).send('Terjadi kesalahan');
    }
  }
  @Get('/dokumen_sertifikat/:id/:document')
  async getSystemCertificate(@Param() data: any, @Res() response: Response) {
    try {
      const dataResp = await this.client
        .send('getDocumentSystem', data)
        .toPromise();
      if (!dataResp || !dataResp.value) {
        // Handle gambar tidak ditemukan
        response.status(404).send('Document tidak ditemukan');
        return;
      }

      const imageBuffer = dataResp.value;

      const buffer = Buffer.from(imageBuffer.data);

      // Set header respons untuk tipe konten PDF
      response.setHeader('Content-Type', 'application/pdf');

      // Set header responsepons untuk menentukan cara file akan ditampilkan oleh browser
      response.setHeader(
        'Content-Disposition',
        `inline; filename=${dataResp.name}`,
      );

      // Kirim buffer sebagai responsepons
      response.send(buffer);
    } catch (error) {
      // Handle kesalahan lainnya
      console.error(error);
      response.status(500).send('Terjadi kesalahan');
    }
  }

  @Get('/dokumen_pejabat/:id/:document')
  async getDocumentPejabat(@Param() data: any, @Res() response: Response) {
    try {
      const dataResp = await this.clientUser
        .send('getDocumentPejabat', data)
        .toPromise();
      if (!dataResp || !dataResp.value) {
        // Handle gambar tidak ditemukan
        response.status(404).send('Dokumen tidak ditemukan');
        return;
      }

      const imageBuffer = dataResp.value;

      const buffer = Buffer.from(imageBuffer.data);

      // Set header respons untuk tipe konten PDF
      response.setHeader('Content-Type', 'application/pdf');

      // Set header responsepons untuk menentukan cara file akan ditampilkan oleh browser
      response.setHeader(
        'Content-Disposition',
        `inline; filename=${dataResp.name}`,
      );

      // Kirim buffer sebagai responsepons
      response.send(buffer);
    } catch (error) {
      // Handle kesalahan lainnya
      console.error(error);
      response.status(500).send('Terjadi kesalahan');
    }
  }
}
