// types/cuaca.ts
export interface DataCuaca {
    kota: string;
    suhu: number;
    kelembaban: number;
    catatan?: string;
}

export type TingkatIAQ = "BAIK" | "SEDANG" | "TIDAK SEHAT" | "SANGAT TIDAK SEHAT" | "BERBAHAYA";

export interface WeatherCardProps {
    kota: string;
    suhu: number;
    tingkatIAQ: TingkatIAQ;
}