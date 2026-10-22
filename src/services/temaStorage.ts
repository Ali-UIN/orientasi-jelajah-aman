// src/services/temaStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PreferensiTema } from "../constants/theme";
const KUNCI_PENYIMPANAN = "@jelajah_aman:tema";
export async function ambilPreferensiTema(): Promise<PreferensiTema> {
  const nilai = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
  if (nilai === "terang" || nilai === "gelap" || nilai === "sistem") return nilai;
  return "sistem"; // default: ikuti pengaturan HP / browser
}
export async function simpanPreferensiTema(tema: PreferensiTema): Promise<void> {
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, tema);
}