// app/_layout.tsx
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TemaProvider, useTema } from "../context/TemaContext";

export default function RootLayout() {
  return (
    <TemaProvider>
      <NavigasiBertema />
    </TemaProvider>
  );
}

// Dipisah agar bisa memakai useTema() (harus berada DI DALAM TemaProvider)
function NavigasiBertema() {
  const { skema, warna } = useTema();
  const dasar = skema === "dark" ? DarkTheme : DefaultTheme;
  // Tema navigasi: mewarnai header, tab bar, dan latar setiap layar
  const temaNavigasi = {
    ...dasar,
    colors: {
      ...dasar.colors,
      primary: warna.tint,
      background: warna.background,
      card: warna.background,
      text: warna.text,
      border: warna.border,
    },
  };

  return (
    <ThemeProvider value={temaNavigasi}>
      <StatusBar style={skema === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[kota]" options={{ title: "Detail Cuaca" }} />
        <Stack.Screen
          name="tambah-favorit"
          options={{ presentation: "modal", title: "Tambah Favorit" }}
        />
      </Stack>
    </ThemeProvider>
  );
}