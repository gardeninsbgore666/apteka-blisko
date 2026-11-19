# Raport końcowy

> **Dokument:** PBL-DOC-006 · **Wersja:** 1.3 · **Autor:** Zespół projektowy · **Data:** 2026-11-19

## 1. Cel

Ułatwić obywatelom znalezienie zarejestrowanej apteki przez prostą, responsywną wyszukiwarkę korzystającą z otwartych danych.

## 2. Rezultaty

Powstała aplikacja webowa z osobnymi filtrami miasta, ulicy i nazwy, linkiem do map, próbką demonstracyjną, skryptem pobierającym rejestr i uruchomieniem przez Docker Compose. Importer składa adres z kolumn źródłowych i odrzuca nieaktywne rekordy. W snapshotcie z 2026-11-19 znaleziono 13 819 aktywnych placówek i 9 aptek przy ul. Grochowskiej w Warszawie. Repozytorium jest publiczne na GitHubie, a strona była uruchomiona na Renderze.

## 3. Porównanie z planem

| Plan | Rezultat | Status |
|---|---|---|
| Wyszukanie zbioru na dane.gov.pl | Rejestr aptek Centrum e-Zdrowia | Zrealizowano |
| Proste demo | Responsywna wyszukiwarka; Docker pobiera pełny rejestr, próbka działa lokalnie | Zrealizowano |
| Pobieranie danych bez commitowania dużych plików | Skrypt zapisuje dane lokalnie | Zrealizowano |
| Dokumentacja, testy i CI | Dodano pliki projektu i workflow | Zrealizowano |
| Publiczne repozytorium | Opublikowane na GitHubie | Zrealizowano |
| Demo online | Strona była widoczna na Renderze; po ostatniej aktualizacji należy potwierdzić nowe wdrożenie i podać publiczny adres demo | Do potwierdzenia |

## 4. Wpływ

Projekt zmniejsza wysiłek potrzebny do przeszukania publicznego rejestru i kieruje użytkownika do mapy. Nie mierzy faktycznej poprawy dostępu do usług; wymaga to testów z użytkownikami. Nie podaje godzin otwarcia ani dostępności leków.

## 5. Wydajność

Pomiar wykonano lokalnie na Node.js 24.22.3 na pliku `data/pharmacies.csv` o rozmiarze 2 102 559 bajtów i 13 819 rekordach. Mediana parsowania CSV wyniosła 119,42 ms (P95: 157,26 ms). Filtrowanie po mieście Warszawa i ulicy Grochowska, powtórzone 100 razy, zwracało 9 rekordów; mediana wyniosła 70,081 ms (P95: 83,539 ms). JSON tych rekordów zajmuje około 3,00 MB.

Pomiar obejmuje parsowanie i logikę filtrowania w Node.js. Nie obejmuje transferu sieciowego, czasu odpowiedzi publicznego hostingu ani renderowania wyników w przeglądarce; te wartości zależą od łącza i urządzenia użytkownika.

## 6. Wnioski

Największą wartość daje prosty interfejs i odtwarzalne pobieranie danych. Rejestr może zmieniać strukturę, więc importer powinien być utrzymywany. Przed prezentacją należy pobrać aktualne dane, sprawdzić dopasowanie nazw kolumn i potwierdzić działanie najnowszego wdrożenia. W kolejnej wersji warto dodać mapę z geokodowaniem, ale dopiero po doborze wiarygodnego źródła współrzędnych i analizie jego warunków.
