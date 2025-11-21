# audioplayer/ — Custom Audio Player (ROKKO Records)

Dieses Verzeichnis enthält eine einfache, visuell angepasste Player‑Implementierung in reinem HTML/CSS/JS,
damit du das Design aus den Referenzbildern testen und später in deine Seite integrieren kannst.

Enthalten:
- index.html — eigenständige Testseite
- audioplayer.css  — Styles (CSS‑Variablen zur Farb‑Anpassung)
- audioplayer.js   — einfache Player‑Logik (Playlist, Play/Pause, Prev/Next, Seek)
- assets/     — Platz für Cover/MP3s (aktuell .gitkeep als Platzhalter)

Schnellstart:
1. Lege deine MP3s und Bilddateien in audioplayer/assets/.
2. Passe in audioplayer/audioplayer.js das Array `playlist` an mit den echten Pfaden.
3. Öffne audioplayer/index.html im Browser (oder über lokalen Server) zum Testen.

Integration ins Projekt:
- Variante A (statisch): Kopiere die relevanten HTML‑Teile in die existierende Seite und binde audioplayer/audioplayer.css / audioplayer/audioplayer.js ein.
- Variante B (React/Vue): Ich kann eine Komponente liefern — sag mir, welches Framework ihr benutzt, dann konvertiere ich die Dateien.

Wenn gewünscht, ersetze ich in einem PR den existierenden Player direkt im Repo — dann bitte den Pfad zur aktuellen Player‑Datei nennen.
