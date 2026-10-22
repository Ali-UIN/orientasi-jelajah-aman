// src/app/(tabs)/index.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HasilGeocoding } from "../../../types/geocoding";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import SearchBox from "../../components/SearchBox";
import StatusData from "../../components/StatusData";
import WeatherCard from "../../components/WeatherCard";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { useTema } from "../../context/TemaContext";
import { useDebounce } from "../../hooks/use-debounce";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
} from "../../services/cacheRepository";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import { cariKota } from "../../services/geocodingService";
import {
  ambilKoordinatSaatIni,
  mintaIzinLokasi,
} from "../../services/locationService";
import { tambahRiwayatPencarian } from "../../services/riwayatPencarianStorage";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";

export default function HalamanUtama() {
  const { warna } = useTema();
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // pencegah race condition
  // Parameter yang dikirim tab Riwayat saat salah satu riwayat diklik
  const { cari, id, lat, lon, negara, t } = useLocalSearchParams<{
    cari?: string;
    id?: string;
    lat?: string;
    lon?: string;
    negara?: string;
    t?: string;
  }>();
  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  // Setiap Beranda dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan terbaru
  useFocusEffect(useCallback(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []));
  // Dibuka dari tab Riwayat: isi kotak cari dengan nama kota lalu langsung tampilkan cuacanya
  useEffect(() => {
    if (!t || !cari || !lat || !lon) return;
    const kota: HasilGeocoding = {
      id: Number(id),
      name: cari,
      latitude: Number(lat),
      longitude: Number(lon),
      country: negara ?? "",
    };
    // naikkan kota ini ke urutan teratas riwayat, apa pun hasilnya tetap tampilkan cuacanya
    tambahRiwayatPencarian(kota).finally(() => {
      setTeksCari(kota.name);
      pilihKota(kota);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sengaja: hanya jalan saat parameter riwayat berubah
  }, [t, cari, id, lat, lon, negara]);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) return; // kotak kosong: daftar disembunyikan lewat hasilTampil
    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    setKotaTerpilih(kota);
    const idSaatIni = ++requestIdRef.current;
    setSedangMemuat(true);
    setPesanError(null);
    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui },
      );
      if (idSaatIni !== requestIdRef.current) return; // hasil basi, abaikan
      setHasil(data);
      muatKotaTersimpan();
    } catch {
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi.",
      );
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }

  // Kota dipilih dari hasil pencarian -> catat ke riwayat (maks 10) lalu tampilkan cuacanya
  function pilihDariPencarian(kota: HasilGeocoding) {
    tambahRiwayatPencarian(kota).catch(() => {});
    pilihKota(kota);
  }
  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
      );
      return;
    }
    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  // Kotak cari kosong -> daftar hasil disembunyikan (tanpa setState di dalam effect)
  const hasilTampil = teksTertunda.trim().length === 0 ? [] : hasilPencarian;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBox nilai={teksCari} onCari={setTeksCari} />
        <Button
          title="Gunakan Lokasi Saat Ini"
          color={warna.tint}
          onPress={gunakanLokasiSaatIni}
        />
        {pesanLokasi && (
          <Text accessibilityLabel={pesanLokasi} style={{ color: warna.warningText }}>
            {pesanLokasi}
          </Text>
        )}
        {hasilTampil.length > 0 && (
          <View
            style={{
              borderWidth: 1,
              borderColor: warna.border,
              borderRadius: 8,
              backgroundColor: warna.card,
            }}
          >
            {hasilTampil.map((kota) => (
              <TouchableOpacity
                key={kota.id}
                onPress={() => pilihDariPencarian(kota)}
                accessibilityLabel={`Pilih ${kota.name}`}
                style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 10 }}
              >
                <Ionicons name="location-outline" size={18} color={warna.tint} />
                <Text style={{ flex: 1, color: warna.text }}>
                  {kota.name}
                  {kota.admin1 ? `, ${kota.admin1}` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "bold", color: warna.text }}>
              Tersimpan di perangkat (bisa dibuka offline)
            </Text>
            {kotaTersimpan.map((k) => (
              <TouchableOpacity
                key={k.kunci}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                onPress={() =>
                  pilihKota({
                    id: k.id,
                    name: k.nama,
                    latitude: k.latitude,
                    longitude: k.longitude,
                    country: "",
                  })
                }
              >
                <Ionicons name="cloud-done-outline" size={16} color={warna.textSecondary} />
                <Text style={{ color: warna.text }}>{k.nama}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {sedangMemuat && <ActivityIndicator color={warna.tint} />}
        {pesanError && (
          <View style={{ gap: 8 }}>
            <Text accessibilityLabel={pesanError} style={{ color: warna.danger }}>
              {pesanError}
            </Text>
            <Button
              title="Coba Lagi"
              color={warna.tint}
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            />
          </View>
        )}
        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              suhuMaksimal={hasil.cuaca.harian.suhuMaksimal[0]}
              suhuMinimal={hasil.cuaca.harian.suhuMinimal[0]}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
            />
            <Text style={{ fontSize: 12, color: warna.textSecondary }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}{" "}
              {"\u2022"} Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>
            <Button
              title="Perbarui Sekarang"
              color={warna.tint}
              onPress={() => pilihKota(kotaTerpilih, true)}
            />
            <Button
              title="Tambahkan ke Favorit"
              color={warna.tint}
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}
        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}
