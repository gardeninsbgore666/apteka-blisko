# Lessons learned

> **Dokument:** PBL-DOC-007 · **Wersja:** 1.0 · **Autor:** Zespół projektowy · **Data:** 2026-11-18

## Co zadziałało

- Zawężenie problemu do szybkiego wyszukiwania konkretnego typu placówki.
- Korzystanie z oficjalnego rejestru i niewłączanie dużych plików do repozytorium.
- Rozdzielenie pobierania, normalizacji i interfejsu ułatwia sprawdzanie zmian źródła.

## Co nie zadziałało / ryzyka

- Sama lista nie pokazuje, czy apteka jest otwarta ani czy ma poszukiwany lek.
- Format i nazwy kolumn rejestru mogą ewoluować; wymagana jest kontrola importu po aktualizacji.
- Publiczny hosting, pomiary wydajności i testy z użytkownikami zależą od środowiska prezentacji i nie są potwierdzone samym kodem.

## Co zrobilibyśmy inaczej

- Wcześniej sprawdzilibyśmy nagłówki aktualnego pliku źródłowego i przetestowali pobranie na docelowym środowisku.
- Przeprowadzilibyśmy krótkie testy użyteczności z osobami o różnych potrzebach, także na telefonie.
- Zebraliśmy pomiary czasu pierwszego wyświetlenia i filtrowania na rzeczywistym urządzeniu.

## Rekomendacje

- Przed każdym pokazem odświeżyć lokalny indeks i sprawdzić losowe rekordy z rejestrem źródłowym.
- Publikować wyniki z jasną datą pobrania i nie obiecywać godzin otwarcia, których dane nie zawierają.
- Przy dodawaniu geolokalizacji opisać źródło współrzędnych, dokładność i prywatność; lokalizacja użytkownika powinna być opcjonalna.
- W prezentacji ujawnić faktycznie użyte narzędzia AI i sposób weryfikacji wygenerowanych treści.
