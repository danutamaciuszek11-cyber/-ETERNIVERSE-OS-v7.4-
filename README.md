# ⚡ ETERNIVERSE OS v7.3 // SVG PATH MINIFIER CORE

> High-precision, zero-dependency SVG vector path data optimization & real-time visual inspection engine built with React 19, TypeScript, and Tailwind CSS.

---

## 🚀 O Projekcie (About the Project)

**SVG Path Minifier & Optimizer** to zaawansowane narzędzie programistyczne i diagnostyczne stworzone w estetyce **High-Contrast Cyberpunk / Neon-Dark HUD**. Pozwala na błyskawiczną kompresję oraz czyszczenie struktur SVG i ścieżek wektorowych (`d="..."`) przy zachowaniu pełnej wizualnej geometrii.

Zaprojektowany z myślą o inżynierach front-endu, twórcach ikon oraz projektantach UI/UX, dbających o minimalny rozmiar assetów graficznych w aplikacjach sieciowych.

---

## ✨ Główne Funkcje (Key Features)

- **⚡ Agresywny Silnik Minifikacji (`SVG-MINIFIER-CORE`)**:
  - Konfigurowalna redukcja precyzji liczb zmiennoprzecinkowych (od 1 do 5 miejsc po przecinku).
  - Inteligenta eliminacja wiodących zer (`0.75` $\rightarrow$ `.75`, `007` $\rightarrow$ `7`).
  - Optymalizacja współrzędnych bezwzględnych na względne (`M`/`L`/`C` $\rightarrow$ `m`/`l`/`c`).
  - Łączenie i zwężanie poleceń rysowania (np. serie `L`/`l` oraz `H`/`V`).
  - Usuwanie zbędnych spacji, separatorów, przecinków i białych znaków.
  - Czyszczenie zbędnych tagów XML, komentarzy HTML oraz sekcji `<metadata>`.

- **👁️ Wizualny Podgląd Nakładany (Visual Diff Viewer)**:
  - Tryb **Overlay Difference Mode**: wizualne nakładanie oryginału (czerwony kontur) na wynik zoptymalizowany (turkusowy kontur).
  - Siatka kontrolna (Grid Pattern Canvas) oraz płynne przełączanie skali podglądu.
  - Telemetria czasu wykonywania w czasie rzeczywistym (**Redukcja %**, **Latencja ms**, **Status Rezonansu**).

- **💾 System Lokalnych Custom Presets (LocalStorage Engine)**:
  - Wbudowane szybkimi profile: *Web Ultra-Light*, *Icon Font Safe*, *Aggressive*, *High Precision*.
  - Możliwość tworzenia, zapisywania w pamięci przeglądarki (`localStorage`), wczytywania i usuwania własnych konfiguracji minifikacji.

- **🔍 Inspekcja Struktury Ścieżek (Path Inspection Table)**:
  - Tabela z podziałem na poszczególne obiekty `<path>` z możliwością kopiowania jednostkowego ciągu `d="..."`.

- **🛡️ Bezpieczeństwo i Diagnostyka (Matrix Check & Sanitizer)**:
  - Konsola diagnostyczna sprawdzająca integralność geometrii i zachowanie współrzędnych float.
  - Moduł sanityzujący blokujący potencjalnie szkodliwe skrypty inline i atrybuty w plikach SVG.

- **📋 Eksport i Kopiowanie**:
  - Błyskawiczne kopiowanie minifikowanego SVG / ścieżki wektorowej do schowka oraz eksport gotowego pliku `.svg`.

---

## 🛠️ Stos Technologiczny (Tech Stack)

| Kategoria | Technologia |
|---|---|
| **UI Framework** | [React 19](https://react.dev/) |
| **Język** | [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Stylizowanie** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Ikony Systemowe** | [Lucide React](https://lucide.dev/) |
| **Dev Server / Bundler** | [Vite 6](https://vitejs.dev/) |
| **Animacje** | Motion / Tailwind Transitions |

---

## 💻 Instrukcja Uruchomienia (Getting Started)

### Wymagania wstępne:
- **Node.js**: v18.0 lub wyższy
- **npm** (lub yarn / pnpm)

### 1. Klonowanie repozytorium i instalacja zależności
```bash
git clone https://github.com/eterniverse/svg-path-minifier.git
cd svg-path-minifier
npm install
```

### 2. Uruchomienie środowiska deweloperskiego
```bash
npm run dev
```
Aplikacja zostanie uruchomiona pod adresem: `http://localhost:3000`

### 3. Kompilacja produkcyjna
```bash
npm run build
```

### 4. Sprawdzanie typów TypeScript (Linter)
```bash
npm run lint
```

---

## 📐 Struktura Projektu (Project Structure)

```
svg-path-minifier/
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Nagłówek HUD z przełącznikiem próbek wektorowych
│   │   ├── OptimizationControls.tsx   # Panel konfiguracji minifikacji & Presety LocalStorage
│   │   ├── VisualDiffViewer.tsx       # Podgląd porównawczy SVG z nakładką telemetrii
│   │   ├── MinificationStats.tsx      # Podsumowanie zysków bajtowych i wskaźników wydajności
│   │   ├── PathDetailsTable.tsx       # Tabela inspekcji poszczególnych ścieżek <path>
│   │   └── MatrixCheckModal.tsx       # Konsola diagnostyczna stanu integralności geometrii
│   ├── utils/
│   │   ├── svgMinifier.ts             # Silnik kompresji SVG-MINIFIER-CORE
│   │   └── sampleSvgs.ts              # Zbiór wektorów testowych (Logotypy, Ikony, Złożone kształty)
│   ├── types.ts                       # Interfejsy TypeScript (MinifyOptions, SavedPreset, itp.)
│   ├── App.tsx                        # Główny interfejs orkiestratora aplikacji
│   ├── index.css                      # Konfiguracja Tailwind CSS
│   └── main.tsx                       # Punkt startowy aplikacji React
├── metadata.json                      # Metadane aplikacji
├── package.json                       # Konfiguracja zależności i skryptów npm
└── README.md                          # Dokumentacja projektu
```

---

## ⚡ Algorytm Minifikacji (`SVG-MINIFIER-CORE`)

Przetwarzanie napisu SVG odbywa się według sekwencyjnego protokołu:

1. **Sanityzacja kodu**: Wychwytywanie i usuwanie znaczników `<script>` oraz zdarzeń inline (`on*="..."`).
2. **Eliminacja metadanych**: Redukcja komentarzy HTML/XML oraz sekcji `<metadata>` i nietypowych przestrzeni nazw.
3. **Optymalizacja komend ścieżek `d=""`**:
   - `0.5000` $\rightarrow$ `.5` (redukcja precyzji zmiennoprzecinkowej)
   - `M 10.00 20.00 L 30.00 40.00` $\rightarrow$ `M10 20L30 40` (eliminacja spacji wokół poleceń)
   - `10 -20` $\rightarrow$ `10-20` (łączenie ujemnych wartości bez znaku separatora)
4. **Czyszczenie strukturalne**: Zwijanie wielokrotnych spacji wewnątrz tagów, czyszczenie niepotrzebnych atrybutów domyślnych oraz usuwanie końcowych średników w stylach.

---

## 📜 Licencja (License)

Projekt udostępniany jest na licencji **MIT**. Zobacz plik `LICENSE` po szczegóły.

---

<p align="center"><strong>ETERNIVERSE OS v7.3 • DEV-CORE PROTOCOL • STABLE</strong></p>
