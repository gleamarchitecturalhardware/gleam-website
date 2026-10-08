# Gleam Architectural Hardware website

Catalogue website built with Next.js 16 (App Router), React 19 and plain CSS modules.

## Run it

```bash
npm install
npm run dev      # http://localhost:3100
npm run build && npm start
```

## Where to edit content

| What | File |
| --- | --- |
| Phone, email, address, hours | `src/data/site.ts` |
| Products (names, codes, specs, dimensions, sizes, finishes) | `src/data/products.ts` |
| Categories and their descriptions | `src/data/categories.ts` |
| Finishes (names, process, care, render colours) | `src/data/finishes.ts` |
| Home page copy | `src/app/page.tsx` |
| About page copy | `src/app/about/page.tsx` |

All product data in `products.ts` is sample content and must be replaced with Gleam's real
codes and specifications before the site goes live.

## Product images

Product images are drawn in code (`src/components/art/`), so every product has a finished
render and a dimensioned technical drawing, in every finish, without photography. Each
drawing has fixed dimension letters (A, B, C, D) that match the `dims` list on the product.

To use real photographs later, add an image path to the product data and render it in
`ProductCard` and `ProductHero` in place of `ProductArt`.

## Enquiries

There is no checkout. Visitors build an enquiry list (saved in their browser) and send it
from the contact page, which opens their email app with the details filled in. To receive
enquiries on a server instead, replace `onSubmit` in `src/components/contact/EnquiryForm.tsx`
with a call to your form or CRM endpoint.
