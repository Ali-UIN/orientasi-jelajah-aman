// app/(tabs)/tentang.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing, typeScale } from "../../constants/styles";
import { useTema } from "../../context/TemaContext";

type NamaIkon = ComponentProps<typeof Ionicons>["name"];

const DAFTAR_FITUR: { ikon: NamaIkon; teks: string }[] = [
  { ikon: "partly-sunny-outline", teks: "Cuaca & kualitas udara kota mana pun" },
  { ikon: "cloud-offline-outline", teks: "Tetap bisa dibuka saat offline (cache SQLite)" },
  { ikon: "time-outline", teks: "Riwayat 10 pencarian terakhir" },
  { ikon: "star-outline", teks: "Simpan kota favorit" },
  { ikon: "moon-outline", teks: "Tema terang, gelap, atau ikuti sistem" },
];

export default function TabTentang() {
  const { warna } = useTema();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.sedang, gap: spacing.kecil }}>
        <Ionicons name="shield-checkmark" size={48} color={warna.tint} />
        <Text
          accessibilityRole="header"
          accessibilityLabel="Halaman Tentang aplikasi Jelajah Aman"
          style={{ fontSize: typeScale.judul, fontWeight: "bold", color: warna.text }}
        >
          Jelajah Aman
        </Text>
        <Text style={{ fontSize: typeScale.isi, color: warna.text }}>Versi 1.0.0</Text>
        <Text style={{ fontSize: typeScale.keterangan, color: warna.textSecondary }}>
          Dibuat oleh Muhammad Irfan Ali
        </Text>

        <Text
          style={{
            fontSize: typeScale.subjudul,
            fontWeight: "bold",
            color: warna.text,
            marginTop: spacing.sedang,
          }}
        >
          Fitur
        </Text>
        {DAFTAR_FITUR.map((fitur) => (
          <View key={fitur.teks} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name={fitur.ikon} size={20} color={warna.tint} />
            <Text style={{ flex: 1, fontSize: typeScale.isi, color: warna.text }}>{fitur.teks}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
