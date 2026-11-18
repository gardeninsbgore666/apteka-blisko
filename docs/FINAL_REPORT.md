# Raport końcowy

> **Dokument:** PBL-DOC-006 · **Wersja:** 1.1 · **Autor:** Zespół projektowy · **Data:** 2026-11-18

## 1. Cel

Ułatwić obywatelom znalezienie zarejestrowanej apteki przez prostą, responsywną wyszukiwarkę korzystającą z otwartych danych.

## 2. Rezultaty

Powstała aplikacja webowa z wyszukiwaniem po nazwie, miejscowości i adresie, linkiem do map, próbką demonstracyjną, skryptem pobierającym rejestr, uruchomieniem lokalnym i przez Docker Compose oraz testami normalizacji. Repozytorium przygotowano do publikacji na licencji MIT.

## 3. Porównanie z planem

| Plan | Rezultat | Status |
|---|---|---|
| Wyszukanie zbioru na dane.gov.pl | Rejestr aptek Centrum e-Zdrowia | Zrealizowano |
| Proste demo | Responsywna wyszukiwarka; Docker pobiera pełny rejestr, próbka działa lokalnie | Zrealizowano |
| Pobieranie danych bez commitowania dużych plików | Skrypt zapisuje dane lokalnie | Zrealizowano |
| Dokumentacja, testy i CI | Dodano pliki projektu i workflow | Zrealizowano |
| Publiczne repozytorium i hosting demo | Wymaga publikacji przez zespół | Do wykonania |

## 4. Wpływ

Projekt zmniejsza wysiłek potrzebny do przeszukania publicznego rejestru i kieruje użytkownika do mapy. Nie mierzy faktycznej poprawy dostępu do usług; wymaga to testów z użytkownikami. Nie podaje godzin otwarcia ani dostępności leków.

## 5. Wnioski

Największą wartość daje prosty interfejs i odtwarzalne pobieranie danych. Rejestr może zmieniać strukturę, więc importer powinien być utrzymywany. Przed prezentacją należy pobrać aktualne dane, sprawdzić dopasowanie nazw kolumn i wykonać pomiary czasu ładowania na docelowym urządzeniu. W kolejnej wersji warto dodać mapę z geokodowaniem, ale dopiero po doborze wiarygodnego źródła współrzędnych i analizie jego warunków.
