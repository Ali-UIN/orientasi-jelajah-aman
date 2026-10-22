// src/components/TombolHapus.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text } from "react-native";
import { useTema } from "../context/TemaContext";
interface TombolHapusProps {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}
// Tombol merah dengan ikon tempat sampah, dipakai di Riwayat dan Pengaturan
export default function TombolHapus({ label, onPress, accessibilityLabel }: TombolHapusProps) {
  const { warna } = useTema();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: warna.danger,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Ionicons name="trash-outline" size={16} color={warna.background} />
      <Text style={{ color: warna.background, fontWeight: "bold", fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}
