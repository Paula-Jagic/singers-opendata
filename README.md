# Skup podataka o popularnim pop pjevačima

## Opis skupa
Ovaj skup podataka sadrži informacije o 10 najpopularnijih međunarodnih pop pjevača. Podaci uključuju osnovne informacije o pjevačima te popis njihovih albuma. Skup je kreiran za potrebe laboratorijske vježbe iz kolegija Otvoreni podaci.

## Metapodaci

1. **Licenca**: Creative Commons Attribution 4.0 International (CC BY 4.0)
2. **Autor**: Paula Jagić
3. **Verzija**: 1.0
4. **Jezik**: Hrvatski
5. **Datum kreiranja**: 21.10.2025.
6. **Posljednje ažuriranje**: 3.11.2025.
7. **Svrha skupa**: Edukativna svrha za laboratorijsku vježbu
8. **Izvor podataka**: Ručno prikupljeni podaci iz javno dostupnih izvora (Wikipedia, službene stranice)
9. **Frekvencija ažuriranja**: Jednokratno
10. **Ključne riječi**: pjevači, pop glazba, albumi, nagrade, glazbena industrija
11. **Format datoteka**: CSV, JSON
12. **Veličina skupa**: 13 zapisa (CSV), 10 objekata (JSON)

## Opis atributa

- **ime_prezime**: Puno ime i prezime pjevača (string)
- **nadimak**: Nadimak pod kojim je poznat (string)
- **datum_rodjenja**: Datum rođenja pjevača (YYYY-MM-DD)
- **mjesto_rodjenja**: Grad i država rođenja (string)
- **zanr**: Glazbeni žanr (string)
- **aktivan_od**: Godina kada je započeo karijeru (integer)
- **broj_nagrada**: Broj osvojenih glazbenih nagrada (integer)
- **broj_albuma**: Ukupan broj albuma (integer)
- **najpoznatije_pjesma**: Naziv najpoznatije pjesme (string)
- **drzava_podrijetla**: Država iz koje pjevač dolazi (string)
- **naziv_albuma**: Naziv glazbenog albuma (string)
- **godina_izdanja**: Godina izdavanja albuma (integer)
- **izdavacka_kuca**: Izdavačka kuća albuma (string)
- **broj_pjesama**: Broj pjesama na albumu (integer)
- **trajanje_minuta**: Trajanje albuma u minutama (integer)

## Struktura podataka
Skup podataka sadrži roditelj-dijete vezu gdje je pjevač roditelj, a albumi su djeca. U CSV formatu ova veza je prikazana ponavljanjem glavnih podataka, dok je u JSON formatu prikazana hijerarhijski.

## Format podataka
- **singers.csv**: 13 redaka, 15 stupaca (format: UTF-8)

- **singers.json**: 10 objekata s hijerarhijskom strukturom (format: UTF-8)
