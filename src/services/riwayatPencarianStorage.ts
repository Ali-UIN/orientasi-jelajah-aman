// src/services/riwayatPencarianStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HasilGeocoding } from "../../types/geocoding";
const KUNCI_PENYIMPANAN = "@jelajah_aman:riwayat_pencarian";
const BATAS_RIWAYAT = 10; // maksimal 10 pencarian terakhir
export async function ambilRiwayatPencarian(): Promise<HasilGeocoding[]> {
  const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
  return json ? JSON.parse(json) : [];
}
export async function tambahRiwayatPencarian(kota: HasilGeocoding): Promise<void> {
  const daftar = await ambilRiwayatPencarian();
  const tanpaDuplikat = daftar.filter((k) => k.id !== kota.id); // buang entri lama kota yg sama
  const daftarBaru = [kota, ...tanpaDuplikat].slice(0, BATAS_RIWAYAT); // terbaru di atas, potong 10
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}
export async function hapusSemuaRiwayatPencarian(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_PENYIMPANAN);
}