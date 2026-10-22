// src/app/(tabs)/riwayat.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { ComponentProps, ReactNode, useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KotaFavorit } from "../../../types/favorit";
import { HasilGeocoding } from "../../../types/geocoding";
import TombolHapus from "../../components/TombolHapus";
import { useTema } from "../../context/TemaContext";
import { daftarKotaTersimpan, hapusCacheKota } from "../../services/cacheRepository";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  ambilRiwayatPencarian,
  hapusSemuaRiwayatPencarian,
} from "../../services/riwayatPencarianStorage";
import { RingkasanKotaTersimpan } from "../../types/cache";
import { konfirmasiHapus } from "../../utils/konfirmasi";

type NamaIkon = ComponentProps<typeof Ionicons>["name"];

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

// Judul tiap bagian: ikon + teks, dengan tombol aksi opsional di kanan
function JudulBagian({ ikon, judul, aksi }: { ikon: NamaIkon; judul: string; aksi?: ReactNode }) {
  const { warna } = useTema();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
      <Ionicons name={ikon} size={20} color={warna.tint} />
      <Text style={{ flex: 1, fontSize: 18, fontWeight: "bold", color: warna.text }}>{judul}</Text>
      {aksi}
    </View>
  );
}

// Satu baris kota: ikon, nama, keterangan, dan tombol di kanan
function BarisKota({
  ikon,
  nama,
  keterangan,
  kanan,
}: {
  ikon: NamaIkon;
  nama: string;
  keterangan?: string;
  kanan?: ReactNode;
}) {
  const { warna } = useTema();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: warna.border,
        backgroundColor: warna.card,
      }}
    >
      <Ionicons name={ikon} size={22} color={warna.textSecondary} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: warna.text }}>{nama}</Text>
        {keterangan ? (
          <Text style={{ fontSize: 12, color: warna.textSecondary }}>{keterangan}</Text>
        ) : null}
      </View>
      {kanan}
    </View>
  );
}

function TeksKosong({ children }: { children: string }) {
  const { warna } = useTema();
  return <Text style={{ color: warna.textSecondary }}>{children}</Text>;
}

export default function TabRiwayat() {
  const { warna } = useTema();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [riwayatCari, setRiwayatCari] = useState<HasilGeocoding[]>([]);
  const [kotaCache, setKotaCache] = useState<RingkasanKotaTersimpan[]>([]);

  // Setiap tab dibuka: muat ulang ketiga daftar agar selalu terbaru
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
      ambilRiwayatPencarian().then(setRiwayatCari);
      daftarKotaTersimpan(20).then(setKotaCache).catch(() => {});
    }, []),
  );

  function bersihkanRiwayat() {
    konfirmasiHapus("Hapus riwayat pencarian?", "Semua riwayat pencarian akan dihapus.", async () => {
      await hapusSemuaRiwayatPencarian();
      setRiwayatCari([]);
    });
  }

  function hapusKotaFavorit(kota: KotaFavorit) {
    konfirmasiHapus("Hapus kota favorit?", `Yakin hapus ${kota.nama} dari favorit?`, async () => {
      await hapusFavorit(kota.id);
      setDaftarFavorit((prev) => prev.filter((k) => k.id !== kota.id));
    });
  }

  // Tombol "Hapus Cache" -> minta konfirmasi dulu, baru hapus dari SQLite
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
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {/* 1. Riwayat pencarian (maks 10) */}
        <JudulBagian
          ikon="time-outline"
          judul="Pencarian Terakhir"
          aksi={
            riwayatCari.length > 0 ? (
              <TombolHapus
                label="Hapus Semua"
                onPress={bersihkanRiwayat}
                accessibilityLabel="Hapus semua riwayat pencarian"
              />
            ) : null
          }
        />
        {riwayatCari.length === 0 && <TeksKosong>Belum ada riwayat pencarian</TeksKosong>}
        {riwayatCari.map((kota) => (
          <Pressable
            key={kota.id}
            onPress={() => bukaRiwayat(kota)}
            accessibilityRole="button"
            accessibilityLabel={`Cari ulang cuaca ${kota.name}`}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <BarisKota
              ikon="search-outline"
              nama={kota.name}
              keterangan={kota.country}
              kanan={<Ionicons name="chevron-forward" size={20} color={warna.textSecondary} />}
            />
          </Pressable>
        ))}

        {/* 2. Kota favorit */}
        <JudulBagian ikon="star-outline" judul={`Kota Favorit (${daftarFavorit.length})`} />
        {daftarFavorit.length === 0 && <TeksKosong>Belum ada kota favorit</TeksKosong>}
        {daftarFavorit.map((kota) => (
          <BarisKota
            key={kota.id}
            ikon="star"
            nama={kota.nama}
            kanan={
              <TombolHapus
                label="Hapus"
                onPress={() => hapusKotaFavorit(kota)}
                accessibilityLabel={`Hapus ${kota.nama} dari favorit`}
              />
            }
          />
        ))}

        {/* 3. Cache offline (SQLite) */}
        <JudulBagian ikon="save-outline" judul="Data Offline Tersimpan" />
        {kotaCache.length === 0 && <TeksKosong>Belum ada data cuaca tersimpan</TeksKosong>}
        {kotaCache.map((kota) => (
          <BarisKota
            key={kota.kunci}
            ikon="cloud-done-outline"
            nama={kota.nama}
            keterangan="Bisa dibuka saat offline"
            kanan={
              <TombolHapus
                label="Hapus Cache"
                onPress={() => hapusCache(kota)}
                accessibilityLabel={`Hapus data offline ${kota.nama}`}
              />
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
