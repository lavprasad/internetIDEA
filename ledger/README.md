# Ledger

Offline spending log. Entries stay in this browser’s `localStorage` under `ledger-v1`. Nothing is uploaded.

## Use

Open `index.html` in a browser. Add an amount, category, date, and optional note. The month control lists that month (newest date first), the total as `$x.xx`, and a category breakdown. Delete a row, or export the visible month as `expenses-YYYY-MM.csv`.

## Tests

From this folder:

```
node test.js
```
