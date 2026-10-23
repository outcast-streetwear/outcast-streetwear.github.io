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
- The built-in list (fallback):
- Each piece is one `piece(...)` line: name, type, front image, back image (`""` if none), tag (`"New"` or `""`), fit.
- Images go in `images/` as `.webp` cutouts on a transparent background.
- Prices, headlines and stories: set them after the list, e.g. `CONFIG.products[0].price = "₹1,499";`

**3. Payment (optional)**
- In the brand's own Razorpay dashboard, create a Payment Link per product and paste its public URL (`https://rzp.io/...`) into that product's `payLink`.

**Never put a password or a Razorpay key secret in this repo.** The endpoint, the access key and payment links are public values by design.

`images/og.jpg` is the preview picture shown when the link is shared on WhatsApp or Instagram.

When the content is final, delete the red "DRAFT" banner and the `noindex` line in the `<head>`.
