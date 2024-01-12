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

    let startColumnCharCode = 'A'.charCodeAt(0);
    let endLetterKe = 0;
    let startLetterKe = 0;
    let startMergedCell;
    let endMergedCell;

    content.forEach((element, key) => {
      if (element.field) {
        if (key <= 21) {
          const columnLength = element.field ? element.field.length : 1;

          let endColumnCharCode = startColumnCharCode + columnLength - 1;
          let startColumnLetter = String.fromCharCode(startColumnCharCode);
          let endColumnLetter = '';

          if (endColumnCharCode > 'Z'.charCodeAt(0)) {
            // Menangani jika melebihi kolom 'Z'
            if (startColumnLetter.charCodeAt(0) <= 'Z'.charCodeAt(0)) {
              const firstLetterCode =
                Math.floor((endColumnCharCode - 1) / 26) + 'A'.charCodeAt(0);

              startColumnCharCode = firstLetterCode;

              endColumnCharCode =
                Math.floor((endColumnCharCode - 1) / 26) +
                'A'.charCodeAt(0) -
                1;
              endColumnLetter = String.fromCharCode(endColumnCharCode);
              endLetterKe++;
            }
          } else {
            endColumnLetter = String.fromCharCode(endColumnCharCode);
          }

          console.log(startLetterKe);
          console.log(endLetterKe);

          if (startLetterKe > 0 && endLetterKe > 0) {
            startMergedCell =
              String.fromCharCode('A'.charCodeAt(0) + startLetterKe - 1) +
              startColumnLetter +
              '1';
            endMergedCell =
              String.fromCharCode('A'.charCodeAt(0) + endLetterKe - 1) +
              endColumnLetter +
              '1';
            if (startLetterKe === endLetterKe - 1) {
              startLetterKe++;
            }
          } else if (endLetterKe > 0) {
            if (startLetterKe === endLetterKe - 1) {
              startLetterKe++;
            }
            startMergedCell = startColumnLetter + '1';
            endMergedCell =
              String.fromCharCode('A'.charCodeAt(0) + endLetterKe - 1) +
              endColumnLetter +
              '1';
          } else {
            startMergedCell = startColumnLetter + '1';
            endMergedCell = endColumnLetter + '1';
          }
          const mergedRange = `${startMergedCell}:${endMergedCell}`;

          console.log(`${key} => `, mergedRange);

          worksheet.mergeCells(mergedRange);
          worksheet.getCell(startMergedCell).value = element.table.replace(
            'Sis',
            '',
          );

          startColumnCharCode = endColumnCharCode + 1;
        }
      }
    });

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
      size: 14,
    };

    await workbook.xlsx.writeFile(tempFilePath);

    return {
      path: process.env.APP_DOMAIN + '/api/storage/statistics/' + filePath,
      status: 200,
    };
  }
}
