# DESIGN.md: Kadeřnictví Žaneta Konečná

Zdroj pravdy pro úvodní stránku. Rozsah: **jen úvodní strana** (zadání).

## 1. Vizuální téma a atmosféra
Salon v tmavé staré růži a černé. Elegantní, osobní, ne dětské. Písmo a skutečné fotky dělají většinu práce.
Podpis webu: **kolo fotek** přes hranici růžové a černé plochy a **logo ŽK**: K má plný rovný dřík, rameno a nožku tvoří čepele otevřených nůžek a tenká očka přecházejí přes dřík (princip z vizitky na Pinterestu, kresba vlastní). Ž je ve stejném jazyce: tlustá diagonála, ramena zúžená do špičky.
Reference z Pinterestu: tenká linková kresba, pramen vlasů přestřižený nůžkami.

## 2. Barvy a role
```css
--rose: #8F4A60;       --rose-rgb: 143, 74, 96;     /* stará tmavá růže, hlavní plocha */
--rose-deep: #6E3347;  --rose-deep-rgb: 110, 51, 71; /* akcent na krémové */
--rose-soft: #D3A1B0;  --rose-soft-rgb: 211, 161, 176; /* popisky na černé */
--ink: #151012;        --ink-rgb: 21, 16, 18;       /* černá */
--cream: #F5EDE2;      --cream-rgb: 245, 237, 226;  /* krémová */
```
Hex hodnoty jen v `:root`. Výjimka: samostatné soubory `logo-zk.svg` a `favicon.svg`.

## 3. Typografie
Google Fonts: `https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=DM+Mono:wght@400;500&display=swap`

| Úroveň | Písmo | Velikost |
|---|---|---|
| H1 | Dancing Script 700 | clamp(4.5rem, 10vw, 9rem) |
| H2 | Dancing Script 700 | clamp(3rem, 6vw, 5.5rem) |
| Řádky služeb | Dancing Script 600 | clamp(3rem, 7vw, 6rem) |
| Text | DM Mono 400 | 1rem |
| Popisky | DM Mono 500, verzálky, proložení .14em | .75rem |

Jiná písma nepoužívat.

## 4. Komponenty
- **Tlačítko hlavní:** krémová plocha, černý text, ostré rohy, verzálky. Hover: černá plocha, krémový text. Active: posun o 1 px. Focus: obrys 2 px.
- **Tlačítko vedlejší:** text s podtržením, hover plocha 10 % krémové.
- **Kolo:** 8 kulatých pozic, aktivní je 2× větší. Ovládání šipkami, pauzou, kliknutím na fotku, šipkami na klávesnici a tažením.
- **Prázdná pozice:** linková kresba pramene a popisek „Fotka 01“. Zmizí, jakmile existuje `foto-N.jpg`.
- **Lišta:** logo vlevo, odkazy uprostřed, bez telefonu. Na mobilu hamburger.
- Všechny ovládací prvky: hover, focus-visible, active, dotyková plocha aspoň 44 px. Stav disabled se na stránce nevyskytuje.

## 5. Rozvržení
Hero 58/42 (růžová/černá), střed kola na černé ploše, aktivní fotka na hranici ploch.
Sekce: Hero s kolem → Pro koho (krémová) → Ceník (růžová, dva sloupce, přesný opis z Facebooku, platný od 1. 7. 2026) → Kontakt (černá) → patička.
Fotky v kole: výřezy z koláží na Facebooku (originály v `IMG`), přednostně záběry bez obličeje.
Vodorovné odsazení `clamp(1rem, 5vw, 5rem)`, žádná mřížka karet.

## 6. Hloubka
Bez stínů. Vrstvy tvoří jen barevné plochy a krémový prstenec kolem fotek.

## 7. Animace (L1, střídmá L2)
- Jemné objevení obsahu (opacity + 16 px, 700 ms, jednou).
- Otočení kola 900 ms, samo o krok po 6 s. Zastaví se při najetí, fokusu, pauze a mimo obraz.
- `prefers-reduced-motion`: bez přechodů a bez samočinného otáčení.

## 8. Co dělat a co ne
**Dělat:** skutečné fotky v kruzích, skutečné kontakty, rodově neutrální texty, velké písmo, proměnné z `:root`.

**Zakázané:**
- vymyšlené ceny, služby, recenze a otevírací doba
- cizí fotky a fotobanky
- mřížka karet služeb
- telefon v liště
- animace písmen po jednom, magnet, parallax, běžící pásy, vlastní kurzor
- přechody v textu, sklo, stíny
- další podstránky (zadání chce jen úvodní stranu)
- dětský vzhled a silné obrysy

## 9. Responzivita
Zlomy 960 / 760 / 480 px. Pod 960 px se plochy skládají pod sebe a aktivní fotka je nahoře na hranici růžové a černé.
Poloměr kola `min(37vw, 230px)`. Žádný vodorovný scroll, dotykové plochy aspoň 44 px.
