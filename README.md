# SmartType Keyboard

A system-wide Android keyboard (Input Method Editor) with built-in AI-powered translation, multiple language layouts, and an emoji picker. Built with Kotlin for the native IME and React Native (Expo) for the settings app.

## Features

- **System-wide keyboard** — works in any app, just like Gboard or SwiftKey
- **20 languages** with native keyboard layouts (QWERTY, Cyrillic, Arabic, Devanagari, Bengali, Thai)
- **AI-powered translation** — type in one language, translate to another with one tap
- **Collapsible translation bar** — hidden by default for a clean typing experience; tap the translate icon to expand
- **My Languages** — pick 2–5 favorite languages and cycle through them instantly
- **Spacebar swipe** — swipe left/right on the spacebar to switch input language
- **Globe key** — tap to cycle your chosen languages, long-press for the full 20-language picker
- **Emoji picker** — categorized emoji panel with smooth scrolling
- **Haptic feedback** — tactile response on every key press
- **Fast rendering** — cached key views with in-place text updates on shift (no full rebuild)

## Supported Languages

| Language | Script | Language | Script |
|----------|--------|----------|--------|
| English | Latin | Russian | Cyrillic |
| Spanish | Latin | Ukrainian | Cyrillic |
| French | Latin | Arabic | Arabic |
| German | Latin | Hindi | Devanagari |
| Portuguese | Latin | Bengali | Bengali |
| Italian | Latin | Thai | Thai |
| Turkish | Latin | Chinese | Latin (Pinyin) |
| Polish | Latin | Japanese | Latin (Romaji) |
| Dutch | Latin | Korean | Latin (Romanized) |
| Vietnamese | Latin | Indonesian | Latin |

## Architecture

```
smarttype/
├── App.tsx                          # React Native entry point
├── src/
│   ├── screens/HomeScreen.tsx       # Settings app UI
│   ├── components/LanguageModal.tsx  # Language picker (single + multi-select)
│   ├── constants/
│   │   ├── languages.ts             # Language definitions
│   │   └── theme.ts                 # Dark theme constants
│   └── types/index.ts               # TypeScript interfaces
├── android/app/src/main/
│   ├── java/com/anonymous/smarttype/
│   │   ├── ime/
│   │   │   ├── SmartTypeIME.kt      # Native keyboard (InputMethodService)
│   │   │   └── TranslationClient.kt # Translation API client (MyMemory)
│   │   ├── bridge/
│   │   │   ├── SettingsBridgeModule.kt  # React Native ↔ Native bridge
│   │   │   └── SettingsBridgePackage.kt # Bridge package registration
│   │   ├── MainActivity.kt
│   │   └── MainApplication.kt
│   ├── res/
│   │   ├── layout/keyboard_layout.xml   # Keyboard XML layout
│   │   ├── drawable/                    # Key backgrounds, button styles
│   │   └── xml/method.xml               # IME metadata & subtypes
│   └── AndroidManifest.xml
└── package.json
```

**Dual architecture:**
- **Settings app** — React Native (Expo) handles the user-facing configuration screen
- **Keyboard IME** — Native Kotlin `InputMethodService` handles all typing, rendering, and translation

Communication between the two happens via `SharedPreferences` through the `SettingsBridge` native module.

## Prerequisites

- Node.js 18+
- Android SDK (API 24+)
- JDK 17
- A physical Android device or emulator
- ADB configured and device connected

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Build and run

```bash
npx expo run:android
```

This compiles the native Android code, installs the APK on your connected device, and starts the Metro bundler.

### 3. Enable the keyboard

1. Open the SmartType app on your device
2. Tap **"Enable in Settings"** — this opens Android's input method settings
3. Toggle **SmartType Keyboard** on
4. Tap **"Choose SmartType Keyboard"** — select SmartType as your active input method

### 4. Configure

- **My Languages** — select 2–5 languages you use most often
- **Translation Languages** — set default source and target languages
- Tap **Save Settings**

## How Translation Works

1. Type text in any app using the SmartType keyboard
2. Tap the translate icon (🌐…) at the top-right of the keyboard
3. The translation bar expands — choose source/target languages and tap **Translate**
4. Tap the translated result to replace your original text

Translation is powered by the [MyMemory API](https://mymemory.translated.net/) — free, no API key required.

## Tech Stack

- **React Native** (Expo SDK 55) — settings app
- **Kotlin** — native Android IME
- **TypeScript** — React Native type safety
- **MyMemory API** — translation backend
- **SharedPreferences** — settings persistence between RN and native

## License

MIT
