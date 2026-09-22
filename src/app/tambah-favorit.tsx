// app/tambah-favorit.tsx
import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";
import { spacing, typeScale } from "../constants/styles";

export default function ModalTambahFavorit() {
    const { kota } = useLocalSearchParams<{ kota?: string }>();

    return (
        <View style={{ padding: spacing.sedang, gap: spacing.kecil }}>
            <Text style={{ fontSize: typeScale.isi }}>
                Tambahkan {kota ?? "kota ini"} ke daftar favorit?
            </Text>
            <Button
                title="Simpan"
                onPress={() => router.back()}
                accessibilityLabel={`Simpan ${kota ?? "kota ini"} ke daftar favorit`}
            />
        </View>
    );
}
