# ROKKO Custom Audio Player

Ein responsiver, moderner Audio-Player für ROKKO Records, der dem ROKKO-Farbschema (#E0C290 Sand, #3D2817 Braun) entspricht.

## 📋 Features

- ✅ **Responsive Design** - Funktioniert auf Desktop, Tablet und Mobile
- ✅ **Playlist-Verwaltung** - Mehrere Tracks mit Klick-Navigation
- ✅ **Vollständige Steuerung** - Play/Pause, Previous/Next, Seek
- ✅ **Autoplay** - Automatischer Wechsel zum nächsten Track
- ✅ **Zeit-Anzeige** - Aktuelle Zeit und Gesamtdauer
- ✅ **Accessibility** - ARIA-Labels und Keyboard-Navigation
- ✅ **ROKKO Design** - Goldene runde Buttons, ROKKO-Farbschema
- ✅ **Einfache Integration** - Automatisches Einfügen in bestehende Seiten

## 🚀 Schnellstart - Demo

Um den Player lokal zu testen:

```bash
# Im Repository-Root:
# Option 1: Python Server
python -m http.server 8000

# Option 2: Node.js Server
npx http-server

# Dann Browser öffnen:
# http://localhost:8000/player/index.html
```

Die Demo-Seite (`player/index.html`) zeigt den Player mit echten Tracks aus dem `mp3/`-Verzeichnis.

## 📁 Dateien

```
player/
├── index.html      # Standalone Demo-Seite
├── player.css      # Player-Styles (ROKKO-Farben, responsiv)
├── player.js       # Player-Logik (Playlist, Controls, Events)
├── integrate.js    # Integrations-Script für bestehende Seiten
└── README.md       # Diese Datei

public/player-assets/
└── .gitkeep        # Platzhalter für eigene Assets
```

## 🔧 Integration in bestehende Seiten

### Methode 1: Mit Integration Script (Empfohlen)

Das `integrate.js`-Script sucht automatisch nach Containern und fügt den Player ein.

**Schritt 1:** Füge das Script in deine HTML-Seite ein:

```html
<!-- Am Ende vor </body> -->
<script src="player/integrate.js"></script>
```

**Schritt 2:** Füge einen Container mit einem der folgenden Selektoren ein:

```html
<!-- Option A: Mit data-attribute -->
<div data-player="replace"></div>

<!-- Option B: Mit ID -->
<div id="replace-player"></div>
```

**Schritt 3 (Optional):** Definiere eine eigene Playlist:

```html
<script>
  // Playlist vor dem integrate.js Script definieren
  window.ROKKO_PLAYLIST = [
    {
      title: 'Track Name',
      artist: 'Artist Name',
      src: 'pfad/zur/audio.mp3',
      cover: 'pfad/zum/cover.jpg'
    },
    // ... weitere Tracks
  ];
</script>
<script src="player/integrate.js"></script>
```

### Methode 2: Manuell

**Schritt 1:** Füge CSS und JS in den `<head>` ein:

```html
<link rel="stylesheet" href="player/player.css">
<script defer src="player/player.js"></script>
```

**Schritt 2:** Füge einen Container ein:

```html
<div id="my-audio-player"></div>
```

**Schritt 3:** Initialisiere den Player:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const playlist = [
      {
        title: 'Always Sunny',
        artist: 'Skaramush Vandango',
        src: 'mp3/vandango/always_sunny.m4a',
        cover: 'mp3/vandango/cover.png'
      },
      // ... weitere Tracks
    ];

    new RokkoAudioPlayer('my-audio-player', playlist);
  });
</script>
```

## 🎨 Design-Anpassungen

Der Player verwendet CSS-Variablen für Farben:

```css
:root {
  --player-sand: #E0C290;          /* ROKKO Sand (immutable) */
  --player-brown-dark: #3D2817;    /* Dunkles Braun für Rahmen */
  --player-brown: #201613;         /* Text-Braun */
  --player-gold: #d4af37;          /* Gold für Buttons */
  --player-gold-light: #f4d678;    /* Helles Gold */
  --player-accent: #B8935F;        /* Akzent Sand/Braun */
  --player-bg: #997A4B;            /* Hintergrund */
}
```

Um Farben anzupassen, überschreibe diese Variablen in deinem eigenen CSS:

```css
.rokko-audio-player {
  --player-gold: #your-color;
}
```

⚠️ **Wichtig:** Die `--player-sand` Farbe (#E0C290) ist gemäß [COLOR_GUIDE.md](../COLOR_GUIDE.md) **permanent festgelegt** und sollte nicht geändert werden.

## 📱 Responsive Breakpoints

- **Desktop (> 768px):** Playlist rechts neben dem Player
- **Mobile (≤ 768px):** Playlist unterhalb des Players

Der Player passt sich automatisch an die Bildschirmgröße an.

## ⚙️ Verhalten

### Autoplay

Der Player spielt automatisch den nächsten Track ab, wenn der aktuelle Track endet. Dies ist das Standard-Verhalten und sorgt für ein kontinuierliches Hörerlebnis. Um das Autoplay-Verhalten anzupassen, kann die `onTrackEnded()` Methode in `player.js` modifiziert werden.

## 🎵 Assets

### Audio-Dateien

Der Player unterstützt folgende Audio-Formate:
- MP3 (`.mp3`)
- M4A/AAC (`.m4a`)
- OGG (`.ogg`)
- WAV (`.wav`)

Lege deine Audio-Dateien in `public/player-assets/` oder verwende existierende Pfade (z.B. `mp3/artist-name/`).

### Cover-Bilder

- **Empfohlene Größe:** 400x400px oder größer (quadratisch)
- **Formate:** JPG, PNG, WebP
- **Speicherort:** `public/player-assets/` oder `mp3/artist-name/cover.png`

Wenn kein Cover angegeben ist, wird ein Platzhalter mit "ROKKO Records" Text angezeigt.

## 🔄 Alte Player ersetzen

Um den bestehenden Player auf deiner Seite zu ersetzen:

**Schritt 1:** Finde den alten Player im HTML:

```bash
# Suche nach existierenden Audio-Player-Elementen
grep -r "audio-player" *.html
```

**Schritt 2:** Ersetze den Container:

```html
<!-- Alt -->
<div class="old-audio-player">
  <!-- alter Player-Code -->
</div>

<!-- Neu -->
<div data-player="replace"></div>
<script src="player/integrate.js"></script>
```

**Schritt 3:** Teste die Integration lokal.

## 🧪 Testen

### Lokales Testen

1. Öffne `player/index.html` in einem Webbrowser
2. Teste alle Features:
   - ▶️ Play/Pause funktioniert
   - ⏮ Previous/Next wechselt Tracks
   - 🎚️ Seek Bar ist verschiebbar
   - 📋 Playlist-Klick lädt Tracks
   - ⏩ Autoplay zum nächsten Track nach Ende
   - 📱 Responsive auf verschiedenen Bildschirmgrößen

### Integration testen

Erstelle eine Test-HTML-Datei:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Player Test</title>
</head>
<body>
  <h1>Player Integration Test</h1>
  <div data-player="replace"></div>
  <script src="player/integrate.js"></script>
</body>
</html>
```

## 🐛 Troubleshooting

### Player wird nicht angezeigt

- ✅ Überprüfe, ob `player.css` und `player.js` korrekt geladen werden (Browser DevTools → Network)
- ✅ Überprüfe die Browser-Konsole auf Fehler
- ✅ Stelle sicher, dass der Container-Selector korrekt ist

### Audio spielt nicht ab

- ✅ Überprüfe den Pfad zur Audio-Datei (relativ zum HTML)
- ✅ Stelle sicher, dass die Audio-Datei existiert und erreichbar ist
- ✅ Überprüfe CORS-Einstellungen bei externen Audio-Quellen
- ✅ Teste mit verschiedenen Browser (Safari, Chrome, Firefox)

### Playlist wird nicht angezeigt

- ✅ Überprüfe die Playlist-Datenstruktur (Array von Objekten mit `title`, `artist`, `src`, `cover`)
- ✅ Stelle sicher, dass `window.ROKKO_PLAYLIST` vor `integrate.js` definiert ist

## 🌐 Browser-Kompatibilität

Getestet und funktioniert in:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## 📝 Playlist-Format

```javascript
const playlist = [
  {
    title: 'Song Title',        // Pflichtfeld: Track-Titel
    artist: 'Artist Name',       // Pflichtfeld: Artist-Name
    src: 'path/to/audio.mp3',   // Pflichtfeld: Pfad zur Audio-Datei
    cover: 'path/to/cover.jpg'  // Optional: Cover-Bild
  }
];
```

## 🔐 Accessibility

Der Player ist barrierefrei:
- ✅ ARIA-Labels auf allen Buttons
- ✅ Keyboard-Navigation (Tab, Enter, Space)
- ✅ Focus-Styles für bessere Sichtbarkeit
- ✅ Screen-Reader-freundlich

## 🚀 Next Steps (für Maintainer)

1. **Assets hinzufügen:** Lege echte Audio-Dateien und Cover-Bilder in `public/player-assets/`
2. **Integration:** Integriere den Player in die Hauptseite (z.B. `index.html`)
3. **Anpassen:** Passe Farben und Design nach Bedarf an (unter Beachtung der [COLOR_GUIDE.md](../COLOR_GUIDE.md))
4. **Testen:** Teste auf verschiedenen Geräten und Browsern
5. **Deployment:** Pushe die Änderungen und deploye via GitHub Pages

## 📄 Lizenz

Teil des ROKKO Records Website-Projekts.

## 🤝 Beitragen

Verbesserungen und Bug-Fixes sind willkommen! Bitte beachte die [COLOR_GUIDE.md](../COLOR_GUIDE.md) für Design-Änderungen.

---

**Viel Spaß mit dem ROKKO Custom Audio Player! 🎵**
