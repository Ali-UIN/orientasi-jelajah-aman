// src/components/SearchBox.tsx
import { TextInput, View } from "react-native";
interface SearchBoxProps {
  nilai: string; // teks dipegang oleh halaman pemanggil (controlled component)
  onCari: (teks: string) => void;
}
export default function SearchBox({ nilai, onCari }: SearchBoxProps) {
  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        value={nilai}
        onChangeText={onCari} // debounce diatur di pemanggilnya
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />
    </View>
  );
}