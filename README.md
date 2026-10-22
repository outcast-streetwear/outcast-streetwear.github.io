# Outcast website (draft)

A one-page shop site for Outcast (@outcastt.in), live at https://outcast-streetwear.github.io. Customers pick a piece, fill in their details on the site, and the order is emailed to the brand. If a Razorpay link is set, a **Pay now** button appears after the order is sent.

## To finish it
Open `index.html` and edit the `CONFIG` block near the bottom.

**1. Orders inbox**
- Orders go through [Web3Forms](https://web3forms.com). The `orderAccessKey` decides which inbox receives them (currently Daksh's Gmail).
- To send orders to the brand instead, create a key at web3forms.com with the brand's email and replace `orderAccessKey`.
- Leave `orderEndpoint` empty to run in demo mode (nothing is sent).

**2. Products**
- Each piece is one `piece(...)` line: name, type, front image, back image (`""` if none), tag (`"New"` or `""`), fit.
- Images go in `images/` as `.webp` cutouts on a transparent background.
- Prices, headlines and stories: set them after the list, e.g. `CONFIG.products[0].price = "₹1,499";`

**3. Payment (optional)**
- In the brand's own Razorpay dashboard, create a Payment Link per product and paste its public URL (`https://rzp.io/...`) into that product's `payLink`.

**Never put a password or a Razorpay key secret in this repo.** The endpoint, the access key and payment links are public values by design.

`images/og.jpg` is the preview picture shown when the link is shared on WhatsApp or Instagram.

When the content is final, delete the red "DRAFT" banner and the `noindex` line in the `<head>`.
