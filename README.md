# Outcast website (draft)

A one-page shop site for Outcast (@outcastt.in). Customers order by Instagram DM: the order message is copied and the DM opens.

## To finish it
Open `index.html` and edit the `CONFIG` block near the bottom:
- `products`: set each product's `name`, `price` and `photo` (put images in an `images/` folder and use `photo: "images/tee-01.jpg"`).
- `payLink`: paste the public Razorpay Payment Link for that product (`https://rzp.io/...`). Leave it empty to show only "Order on Instagram".

**Never put a Razorpay key secret or any password in this repo.** Only public payment links go in `payLink`.

When the content is final, delete the red "DRAFT" banner and the `noindex` line in the `<head>`.
