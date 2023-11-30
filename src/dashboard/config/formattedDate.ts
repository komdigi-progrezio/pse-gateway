export const formattedDate = () => {
  const date = new Date(); // Menggunakan tanggal dan waktu saat ini

  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return formattedDate;
};
