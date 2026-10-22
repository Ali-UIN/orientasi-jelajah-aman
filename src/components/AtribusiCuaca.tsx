// src/components/AtribusiCuaca.tsx
import { Linking, Text, TouchableOpacity } from "react-native";
import { useTema } from "../context/TemaContext";
export default function AtribusiCuaca() {
  const { warna } = useTema();
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL("https://open-meteo.com/")}
    >
      <Text style={{ fontSize: 11, color: warna.textSecondary, textAlign: "center" }}>
        Data cuaca disediakan oleh Open-Meteo.com
      </Text>
    </TouchableOpacity>
  );
}
