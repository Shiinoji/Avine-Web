Central Bicol State University of Agriculture - Sipocot

This project is for the midterm examination in IT ELECT 3.

## JavaScript layout

`script.js` contains behavior shared across the storefront, including the product
catalog, account and cart storage, navigation, theme controls, quick view, and
newsletter interactions. Each page loads its own script after `script.js` so
page behavior can use those shared helpers without loading unrelated page logic.

| HTML page | Page script | Responsibilities |
| --- | --- | --- |
| `index.html` | `js/pages/home.js` | Featured products and hero carousel |
| `shop.html` | `js/pages/shop.js` | Search, filters, sorting, and pagination |
| `contact.html` | `js/pages/contact.js` | Contact form confirmation |
| `auth.html` | `js/pages/auth.js` | Sign-in, sign-up, and redirects |
| `cart.html` | `js/pages/cart.js` | Cart rendering and quantity controls |
| `account.html` | `js/pages/account.js` | Profile and order history |
| `checkout.html` | `js/pages/checkout.js` | Checkout summary and order creation |
| `about-faq.html` | — | Shared behavior; native `<details>` handles FAQ disclosures |

Keep reusable functionality in `script.js` and add page-only behavior to the
matching file under `js/pages/`. Load the common script first in each HTML page.
