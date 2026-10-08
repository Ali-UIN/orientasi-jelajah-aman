// src/app/(tabs)/riwayat.tsx
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../../types/favorit";
export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [kotaMenungguHapus, setKotaMenungguHapus] =
    useState<KotaFavorit | null>(null);
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, []),
  );
  async function hapus(id: number) {
    const kota = daftarFavorit.find((item) => item.id === id);
    if (!kota) return;

    const pesanKonfirmasi = `Yakin hapus ${kota.nama}?`;
    const hapusKota = async () => {
      await hapusFavorit(id);
      setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
    };

    if (Platform.OS === "web") {
      setKotaMenungguHapus(kota);
      return;
    }

    Alert.alert("Konfirmasi hapus", pesanKonfirmasi, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: hapusKota,
      },
    ]);
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Kota Favorit</Text>
      <Text>Tersimpan {daftarFavorit.length} kota</Text>
      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}
      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{kota.nama}</Text>
          <Button title="Hapus" onPress={() => hapus(kota.id)} />
        </View>
      ))}
        <Modal
          visible={kotaMenungguHapus !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setKotaMenungguHapus(null)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
              backgroundColor: "rgba(15, 23, 42, 0.55)",
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: 380,
                borderRadius: 20,
                padding: 24,
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text style={{ fontSize: 28, textAlign: "center" }}>⚠️</Text>
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#172033",
                }}
              >
                Hapus kota favorit?
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  marginBottom: 24,
                  fontSize: 15,
                  textAlign: "center",
                  color: "#64748B",
                }}
              >
                Yakin hapus {kotaMenungguHapus?.nama}?
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  onPress={() => setKotaMenungguHapus(null)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    borderRadius: 10,
                    paddingVertical: 12,
                    backgroundColor: "#E2E8F0",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "#334155" }}>
                    Batal
                  </Text>
                </Pressable>
                <Pressable
                  onPress={async () => {
                    if (kotaMenungguHapus) {
                      await hapusFavorit(kotaMenungguHapus.id);
                      setDaftarFavorit((prev) =>
                        prev.filter((k) => k.id !== kotaMenungguHapus.id),
                      );
                    }
                    setKotaMenungguHapus(null);
                  }}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    borderRadius: 10,
                    paddingVertical: 12,
                    backgroundColor: "#DC2626",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    Hapus
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
    </SafeAreaView>
  );
}
