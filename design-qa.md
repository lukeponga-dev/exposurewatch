# Design QA

## Evidence

- Source visual truth: `docs/design/selected-direction.png`
- Implementation: `http://localhost:4173/`
- Implementation screenshot: browser-rendered capture from the local URL in this QA session
- Viewport: 1440 × 1024 CSS pixels (desktop), with a second responsive check at 390 × 844 CSS pixels
- Source pixels: 1488 × 1058
- Implementation pixels: 1440 × 1024 at the browser-managed device scale factor
- Normalization: full-frame source was fit to the 1440 × 1024 desktop composition; browser chrome was excluded
- State: initial scan screen, successful exposure report, collapsed eight-row breach summary, expanded breach list, and mobile scan form

## Full-view Comparison Evidence

The final desktop capture preserves the selected direction's dark navy surface, two-line editorial headline, cyan global signal imagery, compact trust strip, violet primary action, and above-the-fold scan panel. The globe now blends into the page rather than appearing as a rectangular image. The implementation intentionally omits the mock's invented global record counts and example breach claims; live values appear only after an actual check.

## Focused Region Comparison Evidence

- Hero and scan panel: checked at 1440 × 1024 because typography wrapping, globe integration, and form placement are the critical fidelity surfaces.
- Results: checked after a real `test@example.com` request. Score, severity, record count, breach data classes, and the eight-row summary rendered correctly.
- Mobile: checked at 390 × 844. The headline, trust items, globe, scan panel, input, button, and footer remain readable without horizontal overflow.

## Findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: the system grotesk/monospace pairing matches the reference hierarchy; display wrapping is now two lines at the target desktop width and remains readable on mobile.
- Spacing and layout rhythm: hero proportions, scan-panel placement, grid alignment, and section spacing match the selected direction closely.
- Colors and visual tokens: near-black navy, ice blue/cyan, restrained violet, semantic risk colors, and border contrast are consistent and accessible.
- Image quality and asset fidelity: the generated signal globe is sharp at desktop and mobile sizes, has no visible rectangular background after blending, and follows the selected art direction.
- Copy and content: product-specific copy is concise and avoids unverified global breach statistics from the visual concept.

## Comparison History

1. Initial implementation
   - [P1] Desktop headline wrapped to three lines and the 520px hero pushed the scan action too far below the fold.
   - [P2] The globe asset showed a dark rectangular background against the navy page.
   - [P2] A 213-record response produced an excessively long uncollapsed breach list.
2. Fixes
   - Reduced and widened the display type, compressed the hero, and moved the scan panel above the fold.
   - Applied screen blending to integrate the generated globe asset.
   - Added an eight-row default summary with working Show all / Show summary controls.
3. Post-fix evidence
   - Final desktop capture shows a two-line headline, integrated globe, and visible scan panel.
   - Real API result renders eight rows by default; expansion showed 213 rows and collapse returned to eight.
   - Final responsive capture shows no horizontal overflow at 390 × 844.

## Primary Interactions Tested

- Email input updates and enables the primary button.
- Submit reaches the configured ExposureWatch API and renders a successful report.
- Large breach lists collapse to eight rows.
- Show all and Show summary controls expand and collapse the list.
- Desktop and mobile responsive states render correctly.
- Browser console checked after a clean preview restart. The browser reported one opaque `Object` entry at the local URL with no application stack alongside extension-injection noise; no Svelte runtime error or broken interaction was observed.

## Follow-up Polish

- [P3] A future pass could add verified provider/source metadata if the backend exposes it.

## Implementation Checklist

- [x] Match selected visual hierarchy and palette.
- [x] Preserve the existing API workflow.
- [x] Verify loading, error, success, and large-result behavior.
- [x] Verify desktop and mobile layouts.
- [x] Pass Svelte type checks and production build.

final result: passed
