// app/(tabs)/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useTema } from '../../context/TemaContext';

export default function Layout() {
    const { warna } = useTema(); // warna tab aktif/nonaktif ikut tema
    return (
        <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: warna.tint, tabBarInactiveTintColor: warna.textSecondary }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Beranda',
                    tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="riwayat"
                options={{
                    title: 'Favorit & Riwayat',
                    tabBarLabel: 'Riwayat',
                    tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'time' : 'time-outline'} size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="pengaturan"
                options={{
                    title: 'Pengaturan',
                    tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="tentang"
                options={{
                    title: 'Tentang',
                    tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}