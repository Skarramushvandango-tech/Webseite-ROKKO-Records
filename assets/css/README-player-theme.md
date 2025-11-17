# ROKKO Player Theme

Diese CSS-Datei enthält das neue Theme für Player, Kapitel-Headlines und Artist-Karussells im ROKKO-Stil.

## Verwendung

### 1. CSS und JS einbinden

```html
<link rel="stylesheet" href="assets/css/player-theme.css">
<script src="assets/js/carousel-simple.js"></script>
```

### 2. Frame mit Headline-Bild

```html
<div class="rokko-frame">
  <div class="inner">
    <img src="images/beats.png" alt="ROKKO! Beats" class="headline-img">
    <p>Dein Inhalt hier...</p>
  </div>
</div>
```

### 3. Artist-Karussell

```html
<div class="rokko-frame">
  <div class="inner">
    <img src="images/beats.png" alt="ROKKO! Beats" class="headline-img">
    
    <div class="carousel-caption">Zum kopfnicken Cover klicken</div>
    
    <div class="artist-carousel">
      <button class="carousel-arrow left" aria-label="Vorheriges">◀</button>
      
      <div class="carousel-track">
        <div class="cover">
          <img src="cover1.png" alt="Album 1" style="width:100%;height:100%;object-fit:cover;border-radius:8px">
        </div>
        <div class="cover">
          <img src="cover2.png" alt="Album 2" style="width:100%;height:100%;object-fit:cover;border-radius:8px">
        </div>
        <!-- Weitere Cover hier -->
      </div>
      
      <button class="carousel-arrow right" aria-label="Nächstes">▶</button>
    </div>
  </div>
</div>
```

## CSS-Variablen

Die Farben können über CSS-Variablen angepasst werden:

```css
:root {
  --rokko-sand: #e9d8b8;       /* Heller Sand innen */
  --rokko-brown: #6b4f3a;      /* Mittelbraun Rahmen */
  --rokko-brown-dark: #402a1f; /* Sehr dunkel für Kontur */
  --rokko-accent: #e38b2f;     /* Orange/Gold Akzent */
  --carousel-arrow-bg: #2f241b;/* Pfeil-Hintergrund dunkel */
}
```

## Verfügbare Klassen

- `.rokko-frame` - Äußerer Rahmen mit braunem Hintergrund und dunkler Umrandung
- `.inner` - Innerer Bereich mit sandfarbenem Hintergrund
- `.headline-img` - Bild-Element für Kapitel-Headlines (z.B. beats.png)
- `.headline-banner` - Alternative zu `.headline-img` als Hintergrundbild-Container
- `.carousel-caption` - Dunkler Beschriftungs-Button für Karussell
- `.artist-carousel` - Container für das Artist-Karussell
- `.carousel-track` - Scrollbarer Bereich mit den Covers
- `.cover` - Einzelnes Cover-Element im Karussell
- `.carousel-arrow` - Pfeil-Buttons (mit `.left` oder `.right`)

## Responsive Design

Auf mobilen Geräten (max-width: 600px):
- Covers werden kleiner (160px statt 220px)
- Pfeile werden kleiner (48px statt 58px)
- Headlines haben geringere Höhe (56px statt 72px)

## Live-Demo

Siehe `examples/headline-usage.html` für eine vollständige Demo aller Komponenten.

## Integration in bestehende Seiten

Wenn du diese Styles in eine bestehende CSS-Datei integrieren möchtest (z.B. `styles/override-rokko.css`), kopiere einfach den Inhalt von `player-theme.css` dorthin. Stelle sicher, dass die CSS-Variablen nicht mit bestehenden kollidieren.
