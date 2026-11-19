# Historia zmian

> **Dokument:** PBL-DOC-004 · **Wersja:** 1.2 · **Autor:** Zespół projektowy · **Data:** 2026-11-18

## 1.2.0 — 2026-11-18

- Dodano osobne filtry miasta, ulicy i nazwy apteki z podpowiedziami miejscowości.
- Oddzielono nazwę apteki od podmiotu prowadzącego.
- Wyniki są sortowane według miejscowości i adresu, a importer zapisuje typ placówki.
- Dodano test rozdzielenia nazwy apteki od nazwy przedsiębiorcy.

## 1.1.0 — 2026-11-18

- Wyszukiwanie przyjmuje frazy z przecinkami i skrótami adresowymi, np. „Gdańsk, ul. Mostowa”.
- Obraz Docker pobiera pełny rejestr aptek w czasie budowania; dane nadal nie trafiają do Git.

## 1.0.0 — 2026-11-18

- Pierwsza wersja wyszukiwarki aptek, demonstracyjna próbka danych, skrypt pobierający dane, dokumentacja i CI.
