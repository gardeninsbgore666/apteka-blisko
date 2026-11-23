# Apteka Blisko

> **Dokument:** PBL-DOC-001 · **Wersja:** 1.5 · **Autor:** Zespół projektowy · **Data:** 2026-11-23

Apteka Blisko to otwarta, bezpłatna wyszukiwarka aptek zarejestrowanych w Polsce. Pomaga szybko znaleźć nazwę i adres apteki w miejscowości lub okolicy. Każdy wynik ma odnośnik do mapy.

## Problem i użyteczność

Rozproszone rejestry są trudne do przeszukiwania na telefonie i bez wiedzy o ich strukturze. Aplikacja upraszcza wyszukiwanie po miejscowości, nazwie i adresie. Rejestr nie gwarantuje, że apteka jest aktualnie otwarta ani że ma dany lek — przed wizytą warto skontaktować się z placówką.

## Dane

Źródłem jest [Rejestr aptek udostępniony w katalogu dane.gov.pl](https://dane.gov.pl/pl/dataset/1925/resource/56869), którego dostawcą jest Centrum e-Zdrowia. Skrypt pobiera aktualny plik CSV z publicznego endpointu rejestru i tworzy lokalny, znormalizowany indeks. Łączy typ ulicy, nazwę ulicy, numer budynku i opcjonalny numer lokalu, zachowuje kod pocztowy, miasto i telefon oraz pomija rekordy oznaczone jako nieaktywne. Nazwa apteki jest rozdzielona od nazwy właściciela, a wyniki są sortowane po miejscowości i adresie. Plik z pełnymi danymi nie jest częścią repozytorium. Mała próbka w `src/data/sample_pharmacies.csv` służy do demonstracji i testów.

## Uruchomienie

Wymagania: Node.js 20+ albo Docker z Docker Compose. Bez dodatkowych pakietów.

```bash
docker compose up --build
```

Podczas budowania obrazu Docker skrypt pobiera pełny rejestr przez API dane.gov.pl (wymagany dostęp do internetu). Otwórz http://localhost:8080. Zatrzymanie: `Ctrl+C`.

Alternatywnie, aby uruchomić aplikację z próbką: `node src/server.js`, a następnie http://localhost:8080. Pełne dane pobierzesz przed uruchomieniem przez `node scripts/download_data.js`.

Pobranie i przetworzenie aktualnych danych (wymaga dostępu do internetu):

```bash
node scripts/download_data.js
```

Po pobraniu odśwież stronę. Dane zostaną zapisane lokalnie w `data/pharmacies.csv`, katalog `data/` jest ignorowany przez Git.

## Użycie

Wpisz kryteria osobno: miasto, ulicę i/lub nazwę apteki. Możesz łączyć pola, a wyniki filtrują się na bieżąco bez rozwijanej listy podpowiedzi. Lista pokazuje wyniki po 12, a przycisk „Pokaż kolejne apteki” wyświetla następną porcję. Enter przewija do wyników, a Escape czyści aktualne pole. Przycisk „Mapa” otwiera lokalizację w nowej karcie. Wersja demonstracyjna korzysta z jawnie oznaczonej próbki.

## Struktura

- `src/` — aplikacja webowa i serwer demonstracyjny.
- `tests/` — testy normalizacji danych.
- `scripts/` — pobranie i przygotowanie danych źródłowych.
- `docs/` — raport, lessons learned i opis danych.
- `.github/` — szablony zgłoszeń i CI.

## Jakość i wydajność

Indeks pobiera się raz, a filtrowanie odbywa się po stronie przeglądarki w pamięci. Interfejs nie wysyła zapytań do zewnętrznego API przy każdym wpisanym znaku. Dla lokalnego pliku 2,10 MB z 13 819 rekordami, na Node.js 24.22.3, parsowanie trwało medianowo 119 ms (P95: 157 ms), a filtrowanie po Warszawie i Grochowskiej medianowo 70 ms (P95: 84 ms). To pomiar logiki danych na lokalnym komputerze, bez czasu pobierania przez sieć, renderowania kart w przeglądarce ani pomiaru hostingu. Wyniki zależą od urządzenia.

## Rozwój

Zobacz [CONTRIBUTING.md](CONTRIBUTING.md), [kodeks postępowania](CODE_OF_CONDUCT.md), [raport końcowy](docs/FINAL_REPORT.md) oraz [lessons learned](docs/LESSONS_LEARNED.md).

## Wykorzystanie AI

Przygotowanie tego szkicu wspierał OpenAI Codex (model GPT-6): pomógł dobrać pomysł, napisać kod, testy i dokumentację. Zespół powinien samodzielnie zweryfikować działanie aplikacji i dopasować opis do faktycznego podziału pracy przed oddaniem.

## Licencja

MIT — szczegóły w pliku [LICENSE](LICENSE). Dane źródłowe podlegają warunkom opisanym przez ich dostawcę; repozytorium nie redystrybuuje pełnego rejestru.
