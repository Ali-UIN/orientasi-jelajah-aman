// app/(tabs)/tentang.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { spacing, typeScale } from "../../constants/styles";

export default function TabTentang() {
    return (
        <SafeAreaView style={{ flex: 1, padding: spacing.sedang, gap: spacing.kecil }}>
            <Text
                accessibilityRole="header"
                accessibilityLabel="Halaman Tentang aplikasi Jelajah Aman"
                style={{ fontSize: typeScale.judul, fontWeight: "bold" }}
            >
                Jelajah Aman
            </Text>
            <Text style={{ fontSize: typeScale.isi }}>Versi 1.0.0</Text>
            <Text style={{ fontSize: typeScale.keterangan }}>
                Dibuat oleh Muhammad Irfan Ali
            </Text>
        </SafeAreaView>
    );
}
