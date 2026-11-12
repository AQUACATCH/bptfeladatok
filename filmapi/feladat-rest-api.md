# Önálló feladat: Filmnyilvántartó REST API

## Utasítás
Készíts Express.js szervert, amely REST API-n keresztül lehetővé teszi egy filmgyűjtemény lekérdezését és módosítását.

## Feladatleírás
A szerver egyelőre memóriában tárolja a filmeket, tehát az adatok újraindítás után elvesznek. A filmek adatai:

- `id`: egyedi azonosító
- `cim`: a film címe
- `rendezo`: a rendező neve
- `ev`: a bemutatás éve
- `megnezve`: logikai érték, amely jelzi, hogy láttad-e már a filmet

A szerver az `8000`-es porton fusson. A kliens JSON formátumban küldje az adatokat. A végpontok válaszai is JSON-formátumúak legyenek.

Valósítsd meg a következő műveleteket:

| Metódus | Végpont | Művelet |
| --- | --- | --- |
| `GET` | `/filmek` | Az összes film lekérdezése |
| `GET` | `/filmek/:id` | Egy film lekérdezése azonosító alapján |
| `POST` | `/filmek` | Új film hozzáadása |
| `DELETE` | `/filmek/:id` | Film törlése azonosító alapján |
| `PATCH` | `/filmek/:id` | Egy film adatainak részleges módosítása |

## Részletes követelmények

Az alábbi kezdőadatokat használd, és ezekkel dolgozz a végpontok megvalósításakor:

```js
let filmek = [
  { id: 1, cim: "Az utolsó nyár", rendezo: "Kovács Anna", ev: 2021, megnezve: false },
  { id: 2, cim: "Csendes város", rendezo: "Nagy Péter", ev: 2019, megnezve: true },
  { id: 3, cim: "Holnap után", rendezo: "Tóth Júlia", ev: 2023, megnezve: false },
]
```

1. A `GET /filmek` kérés a teljes tömböt adja vissza.
2. A `GET /filmek/:id` kérés csak a megadott azonosítójú filmet adja vissza. Ha nincs ilyen film, küldj megfelelő hibaüzenetet.
3. A `POST /filmek` kérés törzséből olvasd ki a `cim`, `rendezo`, `ev` és `megnezve` értékeket. Az új film kapjon egyedi `id`-t, majd kerüljön be a tömbbe.
4. A `DELETE /filmek/:id` kérés törölje a megadott filmet. Ha az azonosító nem található, jelezd a hibát, és ne küldj sikeres törlésről szóló választ.
5. A `PATCH /filmek/:id` kérés csak a megadott film elküldött mezőit módosítsa. A többi adat maradjon változatlan. Ha az azonosító nem található, jelezd a hibát.
6. Hibás vagy hiányzó azonosító esetén ne történjen módosítás vagy törlés.
7. Használj beszédes JSON-válaszokat a sikeres műveletek és a hibák jelzésére.

## Kérésminták

Új film hozzáadása (`POST /filmek`):

```json
{
  "cim": "Példa film",
  "rendezo": "Minta Rendező",
  "ev": 2024,
  "megnezve": false
}
```

Egy film megtekintettként jelölése (`PATCH /filmek/2`):

```json
{
  "megnezve": true
}
```

## Ellenőrzés
Indítsd el a szervert, majd Thunder Clienttel, Postmannel vagy más API-klienssel próbáld ki az összes végpontot. Teszteld a sikeres kéréseket és azt is, mi történik nem létező azonosító megadásakor.
