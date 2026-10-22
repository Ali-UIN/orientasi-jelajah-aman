// src/app/(tabs)/riwayat.tsx
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../../types/favorit";
import { daftarKotaTersimpan, hapusCacheKota } from "../../services/cacheRepository";
import { RingkasanKotaTersimpan } from "../../types/cache";
import { HasilGeocoding } from "../../../types/geocoding";
import {
  ambilRiwayatPencarian,
  hapusSemuaRiwayatPencarian,
} from "../../services/riwayatPencarianStorage";
// Klik riwayat -> pindah ke tab Beranda dan otomatis mencari kota tersebut
function bukaRiwayat(kota: HasilGeocoding) {
  router.navigate({
    pathname: "/",
    params: {
      cari: kota.name,
      id: String(kota.id),
      lat: String(kota.latitude),
      lon: String(kota.longitude),
      negara: kota.country ?? "",
      t: String(Date.now()), // penanda unik: klik kota yang sama tetap memicu pencarian
    },
  });
}

// Konfirmasi sebelum menghapus: Alert di HP, window.confirm di browser
// (Alert.alert tidak menampilkan apa pun di react-native-web)
function konfirmasiHapus(judul: string, pesan: string, onHapus: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(`${judul}\n\n${pesan}`)) onHapus();
    return;
  }
  Alert.alert(judul, pesan, [
    { text: "Batal", style: "cancel" },
    { text: "Hapus", style: "destructive", onPress: onHapus },
  ]);
}

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [kotaMenungguHapus, setKotaMenungguHapus] =
    useState<KotaFavorit | null>(null);
  const [riwayatCari, setRiwayatCari] = useState<HasilGeocoding[]>([]);
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
      ambilRiwayatPencarian().then(setRiwayatCari);
      daftarKotaTersimpan(20).then(setKotaCache).catch(() => {});
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
  async function bersihkanRiwayat() {
    await hapusSemuaRiwayatPencarian();
    setRiwayatCari([]);
  }  // Tombol "Hapus Cache" -> minta konfirmasi dulu, baru hapus dari SQLite
  function hapusCache(kota: RingkasanKotaTersimpan) {
    konfirmasiHapus(
      "Hapus data offline?",
      `Data cuaca ${kota.nama} yang tersimpan di perangkat akan dihapus. Kota ini tidak bisa dibuka saat offline sampai dicari lagi.`,
      async () => {
        await hapusCacheKota(kota.kunci);
        setKotaCache((prev) => prev.filter((k) => k.kunci !== kota.kunci));
      },
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
    <ScrollView contentContainerStyle={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Pencarian Terakhir</Text>
        {riwayatCari.length > 0 && (
          <Button title="Bersihkan" onPress={bersihkanRiwayat} />
        )}
      </View>
      {riwayatCari.length === 0 && <Text>Belum ada riwayat pencarian</Text>}
      {riwayatCari.map((kota) => (
        <TouchableOpacity
          key={kota.id}
          onPress={() => bukaRiwayat(kota)}
          accessibilityLabel={`Cari ulang cuaca ${kota.name}`}
        >
          <Text>
            🕘 {kota.name}
            {kota.country ? `, ${kota.country}` : ""}
          </Text>
        </TouchableOpacity>
      ))}
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
      ))}       <Text style={{ fontSize: 18, fontWeight: "bold" }}>Data Offline Tersimpan</Text>
      {kotaCache.length === 0 && <Text>Belum ada data cuaca tersimpan</Text>}
      {kotaCache.map((kota) => (
        <View
          key={kota.kunci}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>💾 {kota.nama}</Text>
          <Button
            title="Hapus Cache"
            color="#DC2626"
            onPress={() => hapusCache(kota)}
            accessibilityLabel={`Hapus data offline ${kota.nama}`}
          />
        </View>
      ))}
      </ScrollView>
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
