# Profil danych

> **Dokument:** PBL-DOC-005 · **Wersja:** 1.1 · **Autor:** Zespół projektowy · **Data:** 2026-11-18

## Źródło

Rejestr aptek w katalogu [dane.gov.pl](https://dane.gov.pl/pl/dataset/1925/resource/56869), dostawca: Centrum e-Zdrowia. Skrypt najpierw pobiera metadane zasobu `56869` z `https://api.dane.gov.pl/1.4/resources/56869`, a następnie używa adresu pliku zwróconego przez API. Dzięki temu link do pliku nie jest na stałe wpisany w kodzie.

## Przetwarzanie

CSV źródłowy jest rozdzielany znakiem `|`. Skrypt `scripts/download_data.js` normalizuje go do UTF-8 CSV z polami: nazwa apteki, adres, kod pocztowy, miejscowość, telefon, podmiot prowadzący i typ placówki. Nazwa apteki jest pokazywana oddzielnie od nazwy firmy prowadzącej aptekę. Puste rekordy są pomijane; rekordy są deduplikowane po identyfikatorze apteki (lub treści pól, jeśli identyfikator nie występuje). Nie zapisujemy pełnego surowego pliku w repozytorium.

## Ograniczenia

Nazwy kolumn mogą się zmienić. Skrypt przerywa pracę, jeśli nie rozpozna podstawowych kolumn, zamiast tworzyć mylący wynik. Rejestr może nie zawierać bieżących godzin otwarcia, dostępności produktów, współrzędnych ani informacji o dostępności architektonicznej. Wyniki nie zastępują potwierdzenia telefonicznego. Dane demo są fikcyjne i nie powinny być używane jako aktualna informacja o realnych placówkach.
