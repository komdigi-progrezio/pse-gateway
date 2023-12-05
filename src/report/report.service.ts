import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { formattedDate } from './config/formattedDate';

@Injectable()
export class ReportService {
  async statistic(data: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Header untuk file Excel
    worksheet.columns = [
      { header: 'no', key: 'no', width: 4 },
      { header: 'Nama Instansi', key: 'nama_instansi', width: 150 },
      {
        header: 'Jumlah',
        key: 'jumlah',
        width: 8,
      },
    ];

    data.forEach((item: any, i: number) => {
      const data = {
        no: i + 1,
        nama_instansi: item.name,
        jumlah: item.total_sistem,
      };
      worksheet.addRow(data);
      item.children.forEach((item: any) => {
        const data = {
          nama_instansi: item.name,
          jumlah: item.total_sistem,
        };
        worksheet.addRow(data).alignment = { indent: 2 };
        item.children.forEach((item: any) => {
          const data = {
            nama_instansi: item.name,
            jumlah: item.total_sistem,
          };
          worksheet.addRow(data).alignment = { indent: 4 };
          item.children.forEach((item: any) => {
            const data = {
              nama_instansi: item.name,
              jumlah: item.total_sistem,
            };
            worksheet.addRow(data).alignment = { indent: 8 };
          });
        });
      });
    });

    worksheet.getColumn('C').alignment = { indent: 0 };

    // Menggunakan Stream untuk menyimpan file Excel
    const timestamp = formattedDate();
    const filePath = `Statistik_${timestamp}.xlsx`;
    const tempFilePath = `temp/${filePath}`;

    await workbook.xlsx.writeFile(tempFilePath);
    return {
      path: process.env.APP_DOMAIN + '/api/storage/statistics/' + filePath,
      status: 200,
    };
  }

  async excel(dataResponse: any) {
    const { content, account_id, name, id, data } = dataResponse;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    data.forEach((element) => {
      worksheet.addRow(element);
    });

    // Menggunakan Stream untuk menyimpan file Excel
    const timestamp = formattedDate();
    const filePath = `Layanan_${timestamp}.xlsx`;
    const tempFilePath = `temp/${filePath}`;

    const cell = worksheet.getRow(1);

    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.font = {
      bold: true,
      size: 20,
    };

    await workbook.xlsx.writeFile(tempFilePath);

    return {
      path: process.env.APP_DOMAIN + '/api/storage/statistics/' + filePath,
      status: 200,
    };
  }
}
