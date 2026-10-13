// app/(tabs)/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function Layout() {
    return (
        <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#1783e9' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Beranda',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="riwayat"
                options={{
                    title: 'Riwayat',
                    tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="pengaturan"
                options={{
                    title: 'Pengaturan',
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="tentang"
                options={{
                    title: 'Tentang',
                    tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}