// src/app/(tabs)/pengaturan.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TombolHapus from "../../components/TombolHapus";
import { PreferensiTema } from "../../constants/theme";
import { useTema } from "../../context/TemaContext";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { konfirmasiHapus } from "../../utils/konfirmasi";

type NamaIkon = ComponentProps<typeof Ionicons>["name"];

// Tiga pilihan mode tampilan
const PILIHAN_TEMA: { nilai: PreferensiTema; label: string; ikon: NamaIkon }[] = [
  { nilai: "terang", label: "Terang", ikon: "sunny-outline" },
  { nilai: "gelap", label: "Gelap", ikon: "moon-outline" },
  { nilai: "sistem", label: "Ikuti Sistem", ikon: "phone-portrait-outline" },
];

export default function TabPengaturan() {
  const { preferensi, ubahPreferensi, warna } = useTema();
  const [pesan, setPesan] = useState<string | null>(null);

  function hapusDataTersimpan() {
    konfirmasiHapus(
      "Hapus semua data offline?",
      "Semua data cuaca yang tersimpan di perangkat akan dihapus.",
      async () => {
        await hapusSemuaCache();
        setPesan("Data cuaca tersimpan sudah dihapus.");
      },
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: warna.text }}>Tampilan</Text>
        <Text style={{ color: warna.textSecondary }}>Pilih mode tampilan aplikasi</Text>
        <View style={{ flexDirection: "row", gap: 8 }} accessibilityRole="radiogroup">
          {PILIHAN_TEMA.map((pilihan) => {
            const aktif = preferensi === pilihan.nilai;
            return (
              <Pressable
                key={pilihan.nilai}
                onPress={() => ubahPreferensi(pilihan.nilai)}
                accessibilityRole="radio"
                accessibilityState={{ checked: aktif }}
                accessibilityLabel={`Mode tampilan ${pilihan.label}`}
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: aktif ? warna.tint : warna.border,
                  backgroundColor: aktif ? warna.backgroundSelected : warna.card,
                }}
              >
                <Ionicons
                  name={pilihan.ikon}
                  size={26}
                  color={aktif ? warna.tint : warna.textSecondary}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: aktif ? "bold" : "normal",
                    color: aktif ? warna.tint : warna.text,
                  }}
                >
                  {pilihan.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: warna.text, marginTop: 16 }}>
          Data
        </Text>
        <View style={{ alignItems: "flex-start" }}>
          <TombolHapus label="Hapus Semua Data Cuaca Tersimpan" onPress={hapusDataTersimpan} />
        </View>
        {pesan && (
          <Text accessibilityLabel={pesan} style={{ color: warna.successText }}>
            {pesan}
          </Text>
        )}

        <Text style={{ color: warna.textSecondary, marginTop: 24 }}>Jelajah Aman · Versi 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
