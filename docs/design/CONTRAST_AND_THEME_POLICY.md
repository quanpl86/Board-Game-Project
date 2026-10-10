# Contrast and Seasonal Theme Safety
**Status:** Mandatory design validation criteria

Observed reference orange `#FF5722` on white ≈ 3.16:1: good for large decorative headline, **not for small white text** under AA normal-text criterion 4.5:1.
Use:
- Brand headline/decorative accent: `#FF5722`.
- On bright orange background: `#111827` text ≈ 5.61:1.
- White text CTA: accessible deeper orange `#C63D14` ≈ 5.15:1.
- Small orange text on white: use deeper accessible orange.
- All values require revalidation after final CSS and font confirmation; don't infer contrast from appearance.

Theme safety gates: do not alter base global brand tokens in campaigns; check semantic text/focus colors by theme/role; reduced motion; transparent overlays; screenshot review and automated accessibility audit; if inaccessible, fall back to baseline semantic token.
