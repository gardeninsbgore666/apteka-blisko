# Historia zmian

> **Dokument:** PBL-DOC-004 · **Wersja:** 1.6 · **Autor:** Zespół projektowy · **Data:** 2026-11-23

## 1.6.0 — 2026-11-23

- Przeniesiono zatwierdzony nowy wygląd na główną stronę aplikacji.
- Uporządkowano wyniki w karty i dodano wyświetlanie kolejnych 12 aptek na żądanie.
- Zachowano wyszukiwanie po mieście, ulicy i nazwie, linki do map, obsługę klawiatury oraz responsywny układ.

## 1.5.0 — 2026-11-19

- Dodano lokalne pomiary parsowania i filtrowania pełnego indeksu do README i raportu końcowego.
- Uaktualniono status publicznego repozytorium; potwierdzenie najnowszego wdrożenia demo pozostaje do wykonania.

## 1.4.0 — 2026-11-19

- Odświeżono wygląd wyszukiwarki i kart wyników, poprawiono układ na telefonach oraz widoczne stany fokusu.
- Usunięto dużą listę podpowiedzi miast; filtrowanie działa bezpośrednio podczas wpisywania.
- Dodano obsługę Enter (przejście do wyników) i Escape (wyczyszczenie bieżącego pola).
- Zablokowano zaznaczanie tekstów interfejsu, pozostawiając możliwość zaznaczania danych aptek; logo nie odświeża już strony po kliknięciu.

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
