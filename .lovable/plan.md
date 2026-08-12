# Footer Redesign Plan

Update the `SiteFooter` component to match a specific dark/white split design with a focus on a full-width payment bar and a refined newsletter section.

## User-facing changes
- **Dark Footer Section**:
    - **Helpline**: Redesigned as a prominent box with an orange border.
    - **Columns**: Structured into "Company", "Help", and "Policy" links.
    - **Newsletter**: Redesigned with a dedicated "Subscribe" button (orange), contact info, and social icons.
- **Bottom Payment Bar**: A new, full-width white bar at the very bottom containing all payment gateway logos.
- **Copyright**: Updated text to "Copyright @ 2026 RaifaNest. All rights reserved." positioned at the bottom left.

## Technical details
- Modify `src/components/SiteFooter.tsx`.
- Update the layout grid to handle the four columns.
- Style the helpline box with `border-primary` (assuming orange/red is the primary color based on context) or a custom orange color if needed.
- Implement the bottom white bar as a separate div outside the main padding container but within the `footer` element.
- Use `paymentMethods` asset for the logo strip.
- Ensure responsive behavior (stacked on mobile, grid on desktop).

## Verification plan
- Inspect the preview to ensure the footer columns are aligned correctly.
- Verify the bottom payment bar stretches full-width and has a white background.
- Check the mobile layout for stacking and readability.
- Confirm the helpline number and social links work as expected.
