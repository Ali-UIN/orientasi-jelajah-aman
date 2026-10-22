// src/components/WeatherCard.tsx
import { Text, View } from "react-native";
import { TingkatAQI, WeatherCardProps } from "../../types/cuaca";
import { spacing, typeScale } from "../constants/styles";
import { useTema } from "../context/TemaContext";
// Warna dipilih agar tetap terbaca di tema terang maupun gelap
const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "#16A34A",
  SEDANG: "#CA8A04",
  TIDAK_SEHAT: "#EA580C",
  BERBAHAYA: "#DC2626",
};
export default function WeatherCard({
  kota,
  suhu,
  suhuMaksimal,
  suhuMinimal,
  tingkatAQI,
  indeksAQI,
}: WeatherCardProps) {
  const { warna } = useTema();
  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;
  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori
${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;
  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: warna.border,
        backgroundColor: warna.card,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: typeScale.judul, color: warna.text }}>
        {kota}
      </Text>
      <Text style={{ fontSize: 32, color: warna.text }}>{suhu}°C</Text>
      <Text style={{ color: warna.textSecondary }}>
        {suhuMaksimal}°C / {suhuMinimal}°C
      </Text>
      <Text
        style={{ color: warnaPerTingkat[tingkatAQI], fontSize: typeScale.isi, fontWeight: "bold" }}
      >
        {teksAQI}
      </Text>
    </View>
  );
}
