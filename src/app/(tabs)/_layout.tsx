// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function Layout() {
    return (
        <Tabs screenOptions={{headerShown: true}}>
            <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
            <Tabs.Screen name="riwayat" options={{ title: 'Riwayat' }} />
            <Tabs.Screen name="pengaturan" options={{ title: 'Pengaturan' }} />
        </Tabs>
    );
}