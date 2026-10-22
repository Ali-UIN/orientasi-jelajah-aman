/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTema } from '@/context/TemaContext';

// Warna mengikuti pilihan tema di Pengaturan (terang / gelap / sistem)
export function useTheme() {
  return useTema().warna;
}