# ROKKO Records - Entwicklungsregeln
## ⚠️ DIESE REGELN SIND VERBINDLICH UND DÜRFEN NICHT IGNORIERT WERDEN ⚠️

---

## Zweck dieses Dokuments

Dieses Dokument enthält alle verbindlichen Regeln für die Entwicklung der ROKKO Records Website. 
**Jede hier dokumentierte Regel wurde vom Projektinhaber genehmigt und darf NICHT rückgängig gemacht werden.**

---

## 🚫 VERBOTENE ELEMENTE

### 1. KEINE EMOJIS
**NIEMALS Emojis auf der Website verwenden!**

- ❌ Keine Play/Pause Emojis (▶️ ⏸️ ⏮️ ⏭️)
- ❌ Keine Smiley-Gesichter
- ❌ Keine Blumen, Sterne oder andere dekorative Emojis
- ❌ Keine Unicode-Symbole die wie Emojis aussehen

**STATTDESSEN:**
- ✅ SVG-Icons für alle Buttons und Symbole
- ✅ CSS-basierte Gestaltung

---

## 🎨 FARBREGELN (IMMUTABLE)

### Permanente Farben - NIEMALS ÄNDERN

| Variable | Hex-Wert | Verwendung | Status |
|----------|----------|------------|--------|
| `--rokko-sand` | `#E0C290` | Frame-Innenbereich | **PERMANENT** |
| `--rokko-brown-dark` | `#3D2817` | Frame-Rahmen | **PERMANENT** |
| `--rokko-brown` | `#201613` | Dunkles Braun/Text | **PERMANENT** |
| `--rokko-accent` | `#B8935F` | Akzent-Farbe | **PERMANENT** |

**Siehe COLOR_GUIDE.md für vollständige Dokumentation.**

---

## 🎵 PLAYER-REGELN

### Der RokkoPlayer ist der EINZIGE Player

1. **ALLE Artist-Klicks öffnen den RokkoPlayer**
   - Klick auf Artist-Bild → RokkoPlayer öffnet sich
   - Klick auf Album im Karussell → RokkoPlayer öffnet sich
   - Identisches Design überall

2. **KEIN separates Artist-Popup mit eigenem Player**
   - Alte Widget-Player wurden entfernt
   - Keine Inline-Player in Modals
   - Nur EIN Player-Design auf der ganzen Seite

3. **Player-Styling**
   - SVG-Icons für alle Buttons (KEINE Emojis)
   - Farben entsprechend COLOR_GUIDE.md
   - Waveform-Visualisierung mit Orange (#d77014)

---

## 📋 ÄNDERUNGS-HISTORIE

Diese Sektion dokumentiert alle wichtigen Entscheidungen:

### 2025-11-28: Player-Vereinheitlichung
- **Entscheidung:** Artist-Klick öffnet RokkoPlayer direkt
- **Grund:** Konsistentes Design überall
- **Commit:** 476a84f
- **NIEMALS RÜCKGÄNGIG MACHEN**

### 2025-11-28: Emojis durch SVG-Icons ersetzt
- **Entscheidung:** Alle Emojis wurden durch SVG-Icons ersetzt
- **Grund:** Benutzer will keine Emojis auf der Website
- **Commit:** 0d0b6b5
- **NIEMALS RÜCKGÄNGIG MACHEN**

### 2025-11-17: Farbschema etabliert
- **Entscheidung:** Sand-Farbe (#E0C290) ist permanent
- **Grund:** Markenidentität
- **NIEMALS RÜCKGÄNGIG MACHEN**

---

## ⚠️ REGELN FÜR ZUKÜNFTIGE ENTWICKLUNG

1. **Vor jeder Änderung dieses Dokument prüfen**
2. **Keine hier dokumentierten Entscheidungen rückgängig machen**
3. **Neue Entscheidungen hier dokumentieren**
4. **Bei Unsicherheit: NICHT ändern**

---

## 🔒 MANIFEST

Ich, als Entwickler, verpflichte mich:

- [ ] KEINE Emojis zu verwenden
- [ ] Die festgelegten Farben NICHT zu ändern
- [ ] Den RokkoPlayer als einzigen Player zu verwenden
- [ ] Dieses Dokument bei jeder neuen Entscheidung zu aktualisieren
- [ ] KEINE bereits getroffenen Entscheidungen rückgängig zu machen

---

**Datum der letzten Aktualisierung:** 2025-11-28
**Dokumentversion:** 1.0

---

## Kontakt

Bei Fragen zu diesen Regeln: Projektinhaber kontaktieren.

**DIESE REGELN SIND VERBINDLICH. VERSTÖSSE ERFORDERN KORREKTUREN.**
