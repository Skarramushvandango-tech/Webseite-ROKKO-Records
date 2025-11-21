# ROKKO Records Audio Player

Ein moderner, responsiver Audio-Player für die ROKKO Records Website, implementiert in Plain HTML, CSS und JavaScript.

## Features

- 🎵 Vollständige Playlist-Unterstützung
- ▶️ Play/Pause, Previous/Next Steuerung
- 🎚️ Lautstärkeregelung mit Mute-Funktion
- ⏱️ Fortschrittsanzeige mit Seek-Funktion (Klick und Drag)
- 📱 Vollständig responsive für mobile Geräte
- ⌨️ Tastatursteuerung (Space, Pfeiltasten, M für Mute)
- ♿ ARIA-Labels für Barrierefreiheit
- 🎨 Anpassbare Farben über CSS-Variablen

## Installation

### Standalone-Nutzung

1. Öffnen Sie `index.html` direkt im Browser
2. Die Playlist muss in `audioplayer.js` mit echten Pfaden zu MP3-Dateien konfiguriert werden

### Integration in bestehende Website

1. Kopieren Sie die benötigten Dateien:
   - `audioplayer.css`
   - `audioplayer.js`
   - `assets/` Ordner mit Cover-Bildern und MP3-Dateien

2. Fügen Sie in Ihrem HTML die CSS- und JS-Dateien ein:

```html
<link rel="stylesheet" href="audioplayer/audioplayer.css">
<script src="audioplayer/audioplayer.js"></script>
```

3. Fügen Sie die Player-HTML-Struktur aus `index.html` ein (`.player-container` div)

## Konfiguration

### Playlist anpassen

Bearbeiten Sie die `playlist` Konstante in `audioplayer.js`:

```javascript
const playlist = [
    {
        title: "Ihr Track-Titel",
        artist: "Künstler Name",
        cover: "assets/cover-bild.jpg",
        src: "assets/track.mp3",
        duration: "3:45"
    },
    // Weitere Tracks...
];
```

### Farben anpassen

Die Farben können über CSS-Variablen in `audioplayer.css` angepasst werden:

```css
:root {
    --bg: #1a1a1a;              /* Hintergrundfarbe */
    --bg-light: #2a2a2a;        /* Hellere Hintergrundfarbe */
    --bg-lighter: #3a3a3a;      /* Noch hellere Hintergrundfarbe */
    --accent: #d4af37;          /* Akzentfarbe (Gold) */
    --gold1: #d4af37;           /* Gold Farbe 1 */
    --gold2: #c5a028;           /* Gold Farbe 2 */
    --text-primary: #ffffff;    /* Primäre Textfarbe */
    --text-secondary: #b0b0b0;  /* Sekundäre Textfarbe */
    --text-muted: #808080;      /* Gedämpfte Textfarbe */
    --progress-bg: #404040;     /* Fortschrittsbalken Hintergrund */
}
```

## Tastatursteuerung

- **Leertaste**: Play/Pause umschalten
- **Pfeil Links**: Vorheriger Track
- **Pfeil Rechts**: Nächster Track
- **Pfeil Hoch**: Lautstärke erhöhen (+10%)
- **Pfeil Runter**: Lautstärke verringern (-10%)
- **M**: Stummschalten/Stummschaltung aufheben

## Asset-Ordner

Der `assets/` Ordner sollte folgende Dateien enthalten:

```
assets/
├── .gitkeep
├── placeholder-cover.svg    (Standard-Cover-Bild)
├── cover1.jpg               (Album-Cover für Track 1)
├── cover2.jpg               (Album-Cover für Track 2)
├── track1.mp3               (MP3-Datei für Track 1)
├── track2.mp3               (MP3-Datei für Track 2)
└── ...
```

## Browser-Kompatibilität

- Chrome/Edge: ✅ Vollständig unterstützt
- Firefox: ✅ Vollständig unterstützt
- Safari: ✅ Vollständig unterstützt
- Mobile Browser: ✅ Vollständig unterstützt

## Technische Details

- **Kein Framework erforderlich**: Pure JavaScript (ES6+)
- **Keine externen Abhängigkeiten**
- **Leichtgewichtig**: < 30 KB gesamt (ohne Audio-Dateien)
- **Responsive**: Funktioniert auf allen Bildschirmgrößen
- **Accessibility**: ARIA-Labels für Screen Reader

## Fehlerbehebung

### Audio wird nicht abgespielt

1. Überprüfen Sie, ob die MP3-Dateipfade in `audioplayer.js` korrekt sind
2. Stellen Sie sicher, dass die MP3-Dateien vom Server erreichbar sind
3. Prüfen Sie die Browser-Konsole auf Fehlermeldungen
4. Beachten Sie CORS-Einstellungen bei Audio-Dateien von anderen Domains

### Cover-Bilder werden nicht angezeigt

1. Überprüfen Sie die Bildpfade in der Playlist-Konfiguration
2. Stellen Sie sicher, dass die Bilder im `assets/` Ordner vorhanden sind
3. Verwenden Sie unterstützte Bildformate (JPG, PNG, WebP)

## Anpassung & Erweiterung

Der Player kann leicht erweitert werden:

- **Shuffle-Funktion**: Fügen Sie eine Zufallswiedergabe hinzu
- **Repeat-Funktion**: Implementieren Sie Track- oder Playlist-Wiederholung
- **Download-Button**: Ermöglichen Sie das Herunterladen von Tracks
- **Social Sharing**: Fügen Sie Social-Media-Share-Buttons hinzu
- **Visualisierung**: Integrieren Sie Audio-Visualisierungen mit Web Audio API

## Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die Browser-Konsole auf Fehlermeldungen
2. Stellen Sie sicher, dass alle Dateien korrekt eingebunden sind
3. Testen Sie mit verschiedenen Audio-Dateien

## Lizenz

Anpassbar für ROKKO Records Website-Nutzung.
