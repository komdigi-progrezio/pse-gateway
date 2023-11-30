import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { formattedDate } from './config/formattedDate';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
  async downloadSystemElectronic(data: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Header untuk file Excel
    worksheet.columns = [
      { header: 'id', key: 'id' },
      { header: 'account_id', key: 'account_id' },
      { header: 'nama_internal', key: 'nama_internal' },
      { header: 'nama_eksternal', key: 'nama_eksternal' },
      { header: 'deskripsi', key: 'deskripsi' },
      { header: 'fungsi', key: 'fungsi' },
      { header: 'cakupan_wilayah', key: 'cakupan_wilayah' },
      { header: 'keterkaitan_sistem', key: 'keterkaitan_sistem' },
      { header: 'keterkaitan_sistem_text', key: 'keterkaitan_sistem_text' },
      { header: 'sifat_khusus', key: 'sifat_khusus' },
      { header: 'created_at', key: 'created_at' },
      { header: 'modified_at', key: 'modified_at' },
      { header: 'approved', key: 'approved' },
      { header: 'approved_date', key: 'approved_date' },
      { header: 'no_reg', key: 'no_reg' },
      { header: 'img_badge', key: 'img_badge' },
      { header: 'flag_sistem_pengaman', key: 'flag_sistem_pengaman' },
      { header: 'flag_sertifikasi', key: 'flag_sertifikasi' },
      { header: 'flag_dasar_hukum', key: 'flag_dasar_hukum' },
      { header: 'flag_sop', key: 'flag_sop' },
      { header: 'kategori_akses', key: 'kategori_akses' },
      { header: 'url', key: 'url' },
      { header: 'publish', key: 'publish' },
      { header: 'publish_date', key: 'publish_date' },
      { header: 'deleted', key: 'deleted' },
      { header: 'flag_tenaga_ahli', key: 'flag_tenaga_ahli' },
      { header: 'is_locked', key: 'is_locked' },
      { header: 'locked_at', key: 'locked_at' },
      { header: 'keylock', key: 'keylock' },
      { header: 'keylock_at', key: 'keylock_at' },
      { header: 'keylock_expired', key: 'keylock_expired' },
      { header: 'approved_publish', key: 'approved_publish' },
      { header: 'approved_publish_date', key: 'approved_publish_date' },
    ];

    // console.log(data);
    // Menambahkan data ke dalam worksheet
    data.forEach((item: any) => {
      worksheet.addRow(item);
    });

    // Menggunakan Stream untuk menyimpan file Excel
    const timestamp = formattedDate();
    const filePath = `Daftar_Sistem_Elektronik_${timestamp}.xlsx`;
    const tempFilePath = `temp/${filePath}`;

    await workbook.xlsx.writeFile(tempFilePath);
    // Mengirim file Excel sebagai response
    return {
      path: process.env.APP_DOMAIN + '/api/storage/report_excel/' + filePath,
      status: 200,
    };
  }
}
