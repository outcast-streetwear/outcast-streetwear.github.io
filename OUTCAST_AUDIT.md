# Outcast website audit

## Audit date and scope

- **Date:** 2026-10-25
- **Scope:** Source files in this workspace and the deployed site at https://outcast-streetwear.github.io/
- **Tools used:** direct source inspection, `git`/filesystem inspection, browser page inspection and Playwright DOM/viewport checks. No installs, scripts, Lighthouse run, or order submission was performed.
- **Could not be checked:** Web3Forms delivery and inbox receipt, the live site's browser console/network log, real UPI payment flow, real pincode API responses, physical-device Instagram in-app-browser behavior, screen-reader behavior, and measured Core Web Vitals. Those findings are marked **UNVERIFIED** where applicable.

## Check-area coverage

- **Functional:** Source paths, generated piece links, modal, bag, form fields, filters, and carousel implementation were inspected; no exhaustive live link crawler, console capture, live form submission, or payment handoff was run.
- **Mobile / Instagram in-app browser:** A 390×844 browser viewport was checked for horizontal overflow, modal content, and hit-area dimensions; physical Instagram in-app behavior, keyboard overlap, touch scrolling, and device-specific carousel gestures remain unchecked.
- **Performance:** Every checked-in image file was inventoried for format, byte size, and dimensions where available; no Lighthouse, throttled profile, or Core Web Vitals measurement was run.
- **Order/payment consistency:** Prepaid/COD text, UPI branches, shipping copy, validation, order IDs, and failure states were inspected; actual Web3Forms, pincode, and UPI provider responses remain unverified.
- **Trust/policies:** `policies.html` was compared with storefront claims; legal adequacy and actual courier/returns practice were not independently verified.
- **SEO/sharing:** Head metadata, generated preview pages, robots directives, favicon, and absent robots/sitemap files were inspected; search-engine indexing after launch was not tested.
- **Accessibility:** Labels, alt text, focus styles, heading order, dialog attributes, and measured hit areas were inspected; screen readers and real assistive technology were not tested.
- **Repo hygiene/security:** Tracked files, ignored `_work`/`.idea` contents, package metadata, generator code, and public configuration values were inspected; no secret-scanning service was run.

## Summary

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 4 |
| Medium | 8 |
| Low | 3 |

Top three fixes:

1. Replace the Web3Forms recipient/access key with an India-based third-party-owned inbox and confirm the legal/privacy owner before launch.
2. Remove every COD branch and label from the source, not only hide it with an empty configuration value.
3. Replace demo/fallback order dead ends with a verified prepaid UPI flow, explicit success-response handling, and an India-based WhatsApp/contact route.

The red draft banner and `noindex,nofollow` directives are **launch blockers**, not bugs in a pre-launch review. They must be removed only after content, policies, payment ownership, and order delivery are final.

## Findings

### OC-001

ID: OC-001  
Severity: High  
Category: Order routing / privacy / ownership  
Location: `index.html:493-496`; `README.md:8-10`  
Observed: Orders are posted to Web3Forms with a hardcoded access key whose repository documentation says the inbox is currently Daksh's Gmail. The stated operating requirement is that an India-based third party owns the order inbox, WhatsApp number, policies, and payment KYC.  
Expected: Customer order data should route to an approved India-based business/operator inbox owned by the responsible party, with the privacy policy matching that owner.  
Evidence: `CONFIG.orderEndpoint` and `CONFIG.orderAccessKey` are hardcoded in the public page; `README.md` explicitly says the current inbox is Daksh's Gmail.  
Fix: Create a Web3Forms key for the India-based operator's inbox, replace the public access key, and update the privacy/contact copy after the operator accepts responsibility. Treat the key as routing configuration, not as a secret.  
Effort: S (<30 min)  
Confidence: High

### OC-002

ID: OC-002  
Severity: High  
Category: Order submission reliability  
Location: `index.html:567-573`, `index.html:1239-1242`  
Observed: `sendOrder()` treats any HTTP 2xx response as success and never parses Web3Forms' response body for an application-level failure. Both the order form and custom form show a success state after that check.  
Expected: A success message should be shown only when the provider confirms acceptance; provider-reported failure should return the user to the form with a clear retry/fallback route.  
Evidence: The promise returns `{ok:true}` after `r.ok` without reading JSON; callers use `.then()` to show “Request sent”/“Order sent”. Actual inbox delivery was not submitted and is **UNVERIFIED-LIVE**.  
Fix: Parse the JSON response, require the provider's documented success flag, throw on a provider-level failure, and keep the button retryable while showing the Instagram/WhatsApp fallback.  
Effort: M (<2 h)  
Confidence: High

### OC-003

ID: OC-003  
Severity: High  
Category: Payment consistency  
Location: `index.html:448`, `index.html:684`, `index.html:1103-1104`, `index.html:1129-1133`  
Observed: The source still contains an explicit “Cash on delivery” radio option, COD fee copy, COD total handling, and COD confirmation copy. It is hidden today only because `CONFIG.codFee` is empty.  
Expected: Prepaid-only policy must have no user-facing or executable COD path. A configuration mistake or future sheet/config change must not re-enable a prohibited payment method.  
Evidence: `#o-cod` is rendered in the HTML and branches in `codPicked()`/`showDone()` contain cash-payment language. In the live checkout inspected at 390×844, the COD control was hidden (`display:none`), so the suspected live COD bug is **rejected for the current deployment**; the dormant source path remains confirmed.  
Fix: Delete the COD markup, `codFee` configuration, COD total logic, radio-change logic, and COD confirmation branch. Keep one prepaid UPI explanation and the 24-hour unpaid-order rule.  
Effort: M (<2 h)  
Confidence: High

### OC-004

ID: OC-004  
Severity: High  
Category: Order completion / contact fallback  
Location: `index.html:572`, `index.html:576`, `index.html:1239-1242`  
Observed: The failure fallback is Instagram DM only, and the site has no `wa.me` link or WhatsApp number. The described traffic is predominantly Instagram mobile traffic, but the owner requirement calls for an India-based WhatsApp/contact route.  
Expected: Failed or uncertain submissions need a second, India-based contact channel with a correctly encoded WhatsApp URL and a named operator.  
Evidence: `FAIL` says “DM us on Instagram”; the only contact link found in source/live DOM is `https://www.instagram.com/outcastt.in/`; no `wa.me` URL exists.  
Fix: Add the approved India-based WhatsApp number as `https://wa.me/91XXXXXXXXXX?text=...`, encode the prefilled message with `encodeURIComponent`, and show the link in send-failure and order-confirmation states.  
Effort: S (<30 min)  
Confidence: High

### OC-005

ID: OC-005  
Severity: Medium  
Category: Size / purchase confidence  
Location: `index.html:1030-1033`, `index.html:1068-1070`; live product modal  
Observed: `CONFIG.sizeChart` is empty and the live product modal has no size-guide link or measurement table. The live modal exposes S–XXL choices but only displays the fit label.  
Expected: Every garment purchase surface should expose real measurements, especially for Instagram mobile traffic and oversized/boxy fits.  
Evidence: The live Snake & Lily modal text contains “SIZE S M L XL XXL” and “Fit Regular” but no “Size guide”; the fallback size chart is `{}`. Sheet-provided size data was not independently validated.  
Fix: Publish supplier measurements in the `Sizes` sheet/tab or `CONFIG.sizeChart`, then show a reachable, keyboard-accessible size guide in every product modal.  
Effort: M (<2 h)  
Confidence: High

### OC-006

ID: OC-006  
Severity: Medium  
Category: Shipping / policy consistency  
Location: `index.html:502-503`, `policies.html:63-67`  
Observed: The storefront repeatedly advertises “Free shipping all over India,” while the policy says “The shipping cost is shown before you pay” and never states that shipping is free.  
Expected: Policies must state the same free-shipping scope and any exclusions, with no suggestion that an undisclosed shipping charge may appear.  
Evidence: Storefront `CONFIG.shippingLine` and live product modal say free shipping; `policies.html` says shipping cost is shown before payment.  
Fix: Replace the policy bullet with the confirmed free-shipping rule, or change every storefront claim if free shipping has exclusions. State pincode/courier exceptions explicitly.  
Effort: S (<30 min)  
Confidence: High

### OC-007

ID: OC-007  
Severity: Medium  
Category: Launch / SEO  
Location: `index.html:6-9`, `policies.html:38`, all generated `p/*/index.html` files  
Observed: The live homepage displays “DRAFT for review · not live yet” and serves `noindex, nofollow`; generated product pages and policies also carry noindex.  
Expected: A launch-ready shop should be indexable and shareable after final review.  
Evidence: The same draft banner and robots directive were observed in source and live homepage. This is a launch blocker by the owner's definition, not a defect while intentionally pre-launch.  
Fix: Before launch, remove the draft banners and noindex directives, regenerate product pages, and verify the live robots behavior. Do not remove them until payment, contact, and policies are owned and final.  
Effort: S (<30 min)  
Confidence: High

### OC-008

ID: OC-008  
Severity: Medium  
Category: Live/source consistency  
Location: `index.html:496-509`; live homepage  
Observed: The checked-in fallback defines 13 products, including Golden Days Long Sleeve at ₹1,199. The live sheet-driven page rendered 12 products, and the live Restricted Tee rendered ₹1,499 while the checked-in fallback says ₹999.  
Expected: The reviewed source, sheet, generated previews, and live catalog should agree on visible product set and prices, or the sheet should be clearly treated as the authoritative release data.  
Evidence: Live DOM inspection found 12 grid products and a ₹1,499 Restricted Tee; source `CONFIG.products` has 13 entries and Restricted Tee ₹999. This is a confirmed deployment/data mismatch, not proof that either price is commercially wrong.  
Fix: Reconcile the Google Sheet and fallback list, regenerate `p/` and `images/og/`, then smoke-test the live catalog against the approved release sheet.  
Effort: M (<2 h)  
Confidence: High

### OC-009

ID: OC-009  
Severity: Medium  
Category: Performance  
Location: `index.html:643-647`, `index.html:720-724`, `index.html:1060-1062`  
Observed: Product images are created dynamically without `loading="lazy"` or `decoding="async"`, and no width/height attributes are set on the product grid/rack images. The page loads product imagery eagerly as the rack and grid render.  
Expected: Below-the-fold product images should be lazy-loaded, and intrinsic dimensions should be supplied to reduce layout shifts.  
Evidence: `garment()` creates `<img>` elements with only `src` and `alt`; `tile()`/rack rendering uses that helper. The checked-in product WebP files are individually small (about 16–76 KB), but there are 22 WebP assets and 14 JPEG assets; no Lighthouse or transfer-waterfall measurement was run.  
Fix: Set `loading="lazy"` and `decoding="async"` for below-fold images, add known dimensions/aspect-ratio boxes, and keep only the first viewport's hero/rack imagery eager.  
Effort: M (<2 h)  
Confidence: High

### OC-010

ID: OC-010  
Severity: Medium  
Category: Mobile accessibility / tap targets  
Location: `index.html:96-99`, `index.html:223-228`; live page at 390×844  
Observed: Several interactive controls are below the requested 44×44 px minimum: the live Bag button measured 46×32 px, filter chips measured 33 px high, and the quantity radio input itself measured 28×26 px. Footer contact/policy links also render as short text-only targets.  
Expected: Primary controls and controls used during a mobile order should have at least a 44×44 px hit area, including filters, bag, quantity, and size controls.  
Evidence: Playwright DOM measurements at 390×844; source `.btn.small`, `.chip`, and `.bagbtn` rules use padding/heights that produce sub-44 px controls. No horizontal overflow was observed at that viewport.  
Fix: Increase hit-area padding/min-height to 44 px without changing visual text size; make the whole size/quantity label clickable and verify keyboard focus remains visible.  
Effort: S (<30 min)  
Confidence: High

### OC-011

ID: OC-011  
Severity: Medium  
Category: SEO / crawl discovery  
Location: repository root  
Observed: No `robots.txt` or `sitemap.xml` exists. The page has a title, description, OG tags, Twitter card type, and favicon, but no canonical link or explicit Twitter title/image tags.  
Expected: At launch, crawlers and social previews should have an explicit canonical URL and a simple sitemap/robots policy consistent with GitHub Pages.  
Evidence: Filesystem check found `robots.txt` and `sitemap.xml` absent; source head contains the listed metadata only.  
Fix: Add a small static `robots.txt`, sitemap for `/` plus approved product/policy URLs, and a canonical link after noindex is removed. Add explicit Twitter title/image if platform testing shows OG fallback is insufficient.  
Effort: S (<30 min)  
Confidence: High

### OC-012

ID: OC-012  
Severity: Medium  
Category: Accessibility / image semantics  
Location: `index.html:381`, dynamic image helpers at `index.html:643-647`  
Observed: The custom-art image has `alt=""` despite being part of the custom-design section, while product images use names but have no explicit loading/error fallback. A broken product image can leave an empty visual area without a user-facing message.  
Expected: Decorative imagery may be empty-alt, but product/custom imagery that communicates the offer should have meaningful alternatives or be explicitly marked decorative; image failure should not make a product impossible to identify.  
Evidence: `custom-art` is the visual for “We'll print it” and is empty-alt; `garment()` creates product images with no `onerror` handling.  
Fix: Decide whether the custom art is decorative; if it communicates the service, give it concise alt text. Add a non-silent image fallback that preserves product name and order controls if a photo fails.  
Effort: S (<30 min)  
Confidence: Medium

### OC-013

ID: OC-013  
Severity: Low  
Category: Accessibility / motion  
Location: `index.html:323-348`  
Observed: The ticker animation is disabled only for `prefers-reduced-motion`; there is no pause/control for users who do not use that OS setting.  
Expected: Promotional motion should not compete with reading or provide a seizure/vestibular risk; reduced-motion support is necessary but a pause strategy is preferable for a sales page.  
Evidence: `.band-track` runs a 32-second infinite animation, with only the reduced-motion media query disabling it. No Lighthouse or user testing was run.  
Fix: Add a small CSS/JS pause-on-focus/hover control or make the ticker static on narrow screens.  
Effort: S (<30 min)  
Confidence: Medium

### OC-014

ID: OC-014  
Severity: Low  
Category: Repository hygiene / public exposure  
Location: `_work/`, `.idea/`, `.gitignore`  
Observed: `_work/` contains audit screenshots, raw/outcast photos, CSVs, copied HTML, and celebrity-cutout assets; `.idea/` contains local IntelliJ project/workspace files. Both directories are ignored and are not in `git ls-files`, so they are not currently tracked in this repository.  
Expected: Scratch material, copied/raw media, and personal editor state should stay outside the publishable repository and must not be accidentally force-added.  
Evidence: `.gitignore` ignores `_work/` and `.idea/`; tracked-file inspection showed neither area. No credential or key was observed in the inspected files, but raw/copy material is unnecessary public-repo risk.  
Fix: Keep them ignored, remove them from any future release archive, and review `_work/` before any `git add -f`. Keep only the generated `p/` previews and required assets in the public tree.  
Effort: S (<30 min)  
Confidence: High

### OC-015

ID: OC-015  
Severity: Low  
Category: Build/repository hygiene  
Location: `package.json`, `tools/build-piece-pages.mjs`  
Observed: The public site's package manifest is private and has one Playwright dev dependency solely for the preview generator; the generator deletes and recreates `p/` and `images/og/` when run. This is relevant tooling, but running it without first reconciling the Google Sheet can overwrite reviewed generated previews.  
Expected: Generated artifacts should be reproducible from an approved data source, and the release process should make the destructive regeneration step explicit.  
Evidence: `package.json` says the site needs no build; `build-piece-pages.mjs` calls `rmSync()` on generated directories and reads the live sheet when configured. No build or install was run.  
Fix: Document an approval/check step before `npm run pages`, or make the generator write to a staging directory and replace outputs only after review.  
Effort: M (<2 h)  
Confidence: High

## Suspected bugs checked

- **COD in the live order modal:** rejected for the current deployment. The source contains dormant COD markup/logic (OC-003), but live checkout hides both the payment field and COD option because `codFee` is empty.
- **Prices not rendering on the product grid:** rejected. The live grid rendered prices, including ₹1,499, ₹1,399, ₹999, ₹799, ₹1,200, and ₹999.
- **No size chart or WhatsApp link on the live page:** size-chart absence confirmed (OC-005); WhatsApp-link absence confirmed (OC-004).

## Improvements ranked by Instagram-mobile order completion per effort

1. Put an India-owned WhatsApp fallback beside every send/failure state; it gives failed Instagram in-app-browser orders a one-tap recovery path.
2. Add a compact size chart directly under the size selector; it removes the highest-confidence apparel hesitation.
3. Show “Prepaid UPI only · unpaid orders released after 24 hours” in the checkout summary; it sets expectations before personal details are entered.
4. Keep the order ID in the confirmation and in the prefilled WhatsApp/UPI note; it makes payment matching easy.
5. Increase mobile hit areas to 44 px; it reduces missed taps in Instagram's constrained browser.
6. Add `loading="lazy"` and image dimensions; it improves first interaction without paid tooling.
7. Add a sticky “Order now” action inside the mobile product view; it reduces scrolling after size selection.
8. Add a visible delivery/pincode exception note before submission; it avoids surprise dead ends after form completion.

## Open questions for the owner

1. Which India-based person/business owns the Web3Forms inbox and customer-data responsibility?
2. Which India-based person/business owns the WhatsApp number, UPI ID, payment KYC, refunds, and policy decisions?
3. Is the Google Sheet the authoritative catalog, and why does it currently omit one fallback product and change Restricted Tee's price?
4. What are the supplier-confirmed measurements for every fit/type and size?
5. Is free shipping unconditional across India, or are there courier/pincode exclusions?
6. What exactly is the 24-hour unpaid-order release policy, and where should it be stated in the confirmation and policies?
7. What return/refund timeline and damaged-item remedy has the operator approved?
8. Has Web3Forms been tested from an Instagram in-app browser with a real test submission and a provider-level failure response?

## Fix order: first 10 changes

1. Confirm the India-based operator, inbox, WhatsApp, UPI/KYC, privacy owner, and returns authority.
2. Replace the Web3Forms routing key and verify a controlled test email without exposing customer data.
3. Remove all COD markup/configuration/branches and retain prepaid UPI-only copy.
4. Define and publish the 24-hour unpaid-order release rule.
5. Add the approved WhatsApp fallback with encoded order-ID/message text.
6. Parse and validate the Web3Forms response body; test success and failure states.
7. Reconcile the Google Sheet, fallback products/prices, generated previews, and live catalog.
8. Add the confirmed size chart and a free-shipping/pincode-exception policy that matches the storefront.
9. Increase mobile hit areas and test the modal with the on-screen keyboard and Instagram in-app browser.
10. Add lazy loading/dimensions, then run a post-launch smoke test for links, metadata, images, and payment handoff.
