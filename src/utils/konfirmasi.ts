// src/utils/konfirmasi.ts
import { Alert, Platform } from "react-native";
// Konfirmasi sebelum menghapus: Alert di HP, window.confirm di browser
// (Alert.alert tidak menampilkan apa pun di react-native-web)
export function konfirmasiHapus(judul: string, pesan: string, onHapus: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(`${judul}\n\n${pesan}`)) onHapus();
    return;
  }
  Alert.alert(judul, pesan, [
    { text: "Batal", style: "cancel" },
    { text: "Hapus", style: "destructive", onPress: onHapus },
  ]);
}
