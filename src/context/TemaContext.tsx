// src/context/TemaContext.tsx
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Appearance, Platform } from "react-native";
import { Colors, PreferensiTema } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ambilPreferensiTema, simpanPreferensiTema } from "@/services/temaStorage";

type SkemaWarna = "light" | "dark";

interface NilaiTema {
  preferensi: PreferensiTema; // pilihan pengguna: terang / gelap / sistem
  skema: SkemaWarna; // hasil akhir yang benar-benar dipakai
  warna: (typeof Colors)[SkemaWarna];
  ubahPreferensi: (tema: PreferensiTema) => void;
}

const TemaContext = createContext<NilaiTema | null>(null);

export function TemaProvider({ children }: { children: ReactNode }) {
  const [preferensi, setPreferensi] = useState<PreferensiTema>("sistem");
  const skemaSistem = useColorScheme();

  // Saat aplikasi dibuka: baca pilihan tema yang tersimpan di perangkat
  useEffect(() => {
    ambilPreferensiTema().then(setPreferensi).catch(() => {});
  }, []);

  // Di Android/iOS, beri tahu sistem agar komponen bawaan (Alert, keyboard)
  // ikut berganti warna. Fitur ini tidak tersedia di web.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const peta = { terang: "light", gelap: "dark", sistem: "unspecified" } as const;
    Appearance.setColorScheme(peta[preferensi]);
  }, [preferensi]);

  function ubahPreferensi(tema: PreferensiTema) {
    setPreferensi(tema);
    simpanPreferensiTema(tema).catch(() => {});
  }

  const skema: SkemaWarna =
    preferensi === "terang"
      ? "light"
      : preferensi === "gelap"
        ? "dark"
        : skemaSistem === "dark"
          ? "dark"
          : "light";

  return (
    <TemaContext.Provider value={{ preferensi, skema, warna: Colors[skema], ubahPreferensi }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema(): NilaiTema {
  const nilai = useContext(TemaContext);
  if (!nilai) throw new Error("useTema harus dipakai di dalam <TemaProvider>");
  return nilai;
}