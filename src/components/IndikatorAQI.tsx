import { Text, View } from "react-native";
import { LaporanUdara } from "../../types/cuaca";

interface IndikatorAQIProps {
  laporan: LaporanUdara;
}

export default function IndikatorAQI({ laporan }: IndikatorAQIProps) {
  const warnaTingkat = {
    BAIK: "green",
    SEDANG: "orange",
    TIDAK_SEHAT: "red",
    BERBAHAYA: "darkred",
  }[laporan.tingkat];

  return (
    <View>
      <Text>{laporan.kota}</Text>
      <Text>Indeks AQI: {laporan.indeksAQI}</Text>
      <Text style={{ color: warnaTingkat }}>Tingkat: {laporan.tingkat}</Text>
      {laporan.diperbaruiPada && <Text>Diperbarui: {laporan.diperbaruiPada}</Text>}
    </View>
  );
}