# Tab

Offline bill splitter. Open `index.html` in a browser. Nothing is uploaded and there is no account.

Enter the subtotal, tax percent, and tip percent. Tax and tip start at 0, and a blank tax or tip field counts as 0. Each person needs a name and a whole number of shares (at least 1). Press **Split**.

The people and the last inputs are stored in this browser under `tab-v1`, so a refresh keeps the form. A split stays on screen until you press Split again.

Check the math with:

```
node test.js
```

Cents are conserved. Money is integer cents. Tax is rounded onto the subtotal, then tip is rounded onto that. Each person gets the floor of their weighted share, and leftover cents go to the first people in the list, one each, so the shares add up to the total exactly.
