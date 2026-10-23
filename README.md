# Outcast website (draft)

A one-page shop site for Outcast (@outcastt.in), live at https://outcast-streetwear.github.io. Customers pick a piece, fill in their details on the site, and the order is emailed to the brand. If a Razorpay link is set, a **Pay now** button appears after the order is sent.

## To finish it
Open `index.html` and edit the `CONFIG` block near the bottom.

**1. Orders inbox**
- Orders go through [Web3Forms](https://web3forms.com). The `orderAccessKey` decides which inbox receives them (currently Daksh's Gmail).
- To send orders to the brand instead, create a key at web3forms.com with the brand's email and replace `orderAccessKey`.
- Leave `orderEndpoint` empty to run in demo mode (nothing is sent).

**2. Products**
- Day to day, the brand edits the Google Sheet "Outcast website pieces (edit this)" (its ID is `sheetId` in `index.html`). The site reads it on every visit:
  - **Show**: `no` hides a piece (sold out). **Price**: type a number like `1499`, it shows as ₹1,499.
  - **Photo / Back photo**: either an existing image name from `images/` (e.g. `fomo-front`) or a Google Drive link to a photo shared "Anyone with the link".
  - The first row (headings) must stay as it is. If the sheet can't be reached, the site uses the built-in list below.
- The sheet must be shared as "Anyone with the link: Viewer" for the site to read it.
- Keep the pieces tab as the **first** tab: the site reads the first tab for pieces.
- **Size guide**: add a second tab named exactly `Sizes`. Row 1: `Fit`, `Size`, then one column per measurement, e.g. `Chest (cm)`, `Length (cm)`, `Shoulder (cm)`, `Sleeve (cm)` (the headings are shown as typed). Each row after that is one size of one fit, e.g. `Oversized | M | … | …`. In the `Fit` column you can also write a type (e.g. `Hoodie`) when hoodies measure differently from tees of the same fit; a type wins over a fit. A piece shows a "Size guide" link only when its fit or type has rows. Use real measurements from the supplier, taken with the piece laid flat.
- The built-in list (fallback):
- Each piece is one `piece(...)` line: name, type, front image, back image (`""` if none), tag (`"New"` or `""`), fit.
- Images go in `images/` as `.webp` cutouts on a transparent background.
- Prices, headlines and stories: set them after the list, e.g. `CONFIG.products[0].price = "₹1,499";`

**3. Payment (optional)**
- In the brand's own Razorpay dashboard, create a Payment Link per product and paste its public URL (`https://rzp.io/...`) into that product's `payLink`.
- A payment link has a fixed amount, so **Pay now** only appears when the order is one piece, quantity 1. Bigger orders get UPI details by message.

**4. Bag and order card**
- Buyers can add several pieces to a bag (saved only in their own browser) and send them as one order. The order email lists every piece, and a subtotal when every price is a plain number.
- After ordering, the buyer gets an order card sized for an Instagram story, to share or save. It shows the order ID and pieces, never their name, phone or address.

**5. Piece links and previews**
- Each piece has its own link, e.g. `https://outcast-streetwear.github.io/p/fragile-tee/`. **Share this piece** on a piece's page copies or shares it, and WhatsApp and Instagram show that piece's picture.
- The previews are made by a script. Run it after adding, renaming or re-photographing pieces, then commit `p/` and `images/og/`:
  - First time: install [Node.js](https://nodejs.org), then `npm install` and `npx playwright install chromium`
  - Every time: `npm run pages`
- A new piece whose preview hasn't been built yet still works: its link opens the piece, just with the general preview picture.
- Old links like `#piece-3` still open a piece, but by its position in the list, so they can point to a different piece after the sheet is reordered.

**Never put a password or a Razorpay key secret in this repo.** The endpoint, the access key and payment links are public values by design.

`images/og.jpg` is the preview picture shown when the link is shared on WhatsApp or Instagram.

When the content is final, delete the red "DRAFT" banner and the `noindex` line in the `<head>`, then run `npm run pages` again so the preview pages drop their `noindex` too.
