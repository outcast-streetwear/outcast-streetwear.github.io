# Outcast website (draft)

A one-page shop site for Outcast (@outcastt.in). Customers pick a piece, fill in their details on the site, and the order is sent to the brand. If a Razorpay link is set, a **Pay now** button appears after the order is sent.

## To finish it
Open `index.html` and edit the `CONFIG` block near the bottom.

**1. Orders inbox (needed so orders reach the brand)**
- Create a free form on [Formspree](https://formspree.io) using the brand's email. It gives a URL like `https://formspree.io/f/xxxxxxxx`.
- Paste it into `orderEndpoint`. Until then the site runs in demo mode and sends nothing.
- Other services that need a public key (for example Web3Forms) can use `orderAccessKey`.

**2. Products**
- Set each product's `name`, `price`, `headline`, `story` and `details`.
- Put photos in an `images/` folder and set `photo: "images/tee-01.jpg"`.

**3. Payment (optional)**
- In the brand's own Razorpay dashboard, create a Payment Link per product and paste its public URL (`https://rzp.io/...`) into that product's `payLink`.

**Never put a password or a Razorpay key secret in this repo.** The endpoint, the access key and payment links are public values by design.

When the content is final, delete the red "DRAFT" banner and the `noindex` line in the `<head>`.
