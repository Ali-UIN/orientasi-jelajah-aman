// app/(tabs)/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function Layout() {
    return (
        <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#1783e9', tabBarInactiveTintColor: '#8E8E93' }}>
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