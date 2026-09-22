//components/RiwayatList.tsx
import { Link } from "expo-router";
import { Text, View } from "react-native";

interface RiwayatListProps {
  daftarKota: string[];
}

export default function RiwayatList({ daftarKota }: RiwayatListProps) {
  return (
    <View>
      {daftarKota.map((kota) => (
        // Format link ke halaman detail dengan menggunakan nama kota sebagai parameter
        // Format objek pada href lolos pengecekan TypeScript Expo Router
        <Link
          key={kota}
          href={{ pathname: "/detail/[kota]", params: { kota } }}
        >
          <Text>{kota}</Text>
        </Link>
      ))}
    </View>
  );
}
