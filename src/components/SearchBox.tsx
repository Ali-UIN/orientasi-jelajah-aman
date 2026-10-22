// src/components/SearchBox.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextInput, View } from "react-native";
import { useTema } from "../context/TemaContext";
interface SearchBoxProps {
  nilai: string; // teks dipegang oleh halaman pemanggil (controlled component)
  onCari: (teks: string) => void;
}
export default function SearchBox({ nilai, onCari }: SearchBoxProps) {
  const { warna } = useTema();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: warna.border,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: warna.card,
      }}
    >
      <Ionicons name="search" size={18} color={warna.textSecondary} />
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={warna.textSecondary}
        value={nilai}
        onChangeText={onCari} // debounce diatur di pemanggilnya
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{ flex: 1, paddingVertical: 10, color: warna.text }}
      />
    </View>
  );
}
