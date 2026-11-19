# Historia zmian

> **Dokument:** PBL-DOC-004 · **Wersja:** 1.3 · **Autor:** Zespół projektowy · **Data:** 2026-11-19

## 1.3.0 — 2026-11-19

- Dopasowano importer do faktycznych kolumn Rejestru Aptek: typ i nazwa ulicy, numer budynku i lokalu, telefon, nazwa apteki i właściciel.
- Odfiltrowano rekordy nieaktywne.
- Brakujące nazwy, telefony i kody pocztowe są jawnie oznaczane zamiast uzupełniania ich domyślnym tekstem.
- Zweryfikowano aktualny indeks: 13 819 aktywnych rekordów i 9 aptek przy ul. Grochowskiej w Warszawie.

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
