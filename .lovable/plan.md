# Jaipur Botanical UI Redesign

## Goal
Refactor the existing Pawsitive Diagnostics visual layer to match the selected “Jaipur botanical elegance” direction while preserving every route, interaction, role flow, API, and data source.

## Design system
- Apply the locked green, sage, cream, terracotta, dusty-blue, gold, and dark-text palette through shared semantic tokens.
- Keep DM Serif Display for headings and use a clean, highly legible sans-serif for body copy.
- Standardize cards, buttons, inputs, chips, tabs, sheets, alerts, loading states, empty states, shadows, borders, and focus states.
- Use generous spacing, white cards, rounded 20–28px surfaces, and sparse botanical/Jaipur accents only.
- Preserve the centered mobile app frame across 360/390/430px; keep tablet and desktop previews centered and polished.

## Shared app structure
- Redesign the owner header, notification panel, SOS sheet, side drawer, phone frame, and five-tab bottom navigation.
- Add the restrained animal-frieze/nav ornament from the selected direction without embedding the reference image.
- Apply role-aware theme attributes consistently so pet-owner and veterinary colors resolve correctly.
- Keep all existing route guards, swipe gestures, notifications, navigation, and emergency actions.

## Owner experience
- Recompose Home to match the selected reference: location, search/filter row, deep-green health card, fact card, compact collar status, sensor grid, and quick access.
- Propagate shared cards, section headers, forms, tabs, buttons, sheets, and empty/error/loading treatments across Map, Clinics, Community, AI, Breeds, Report, Settings, Auth, onboarding, avatar, and all sensor screens.
- Preserve every current interaction including live location, clinic directions, community posting/voting/comments/bookmarks, collar actions, exports, media actions, Pet Match, and multi-pet settings.

## Veterinary experience
- Restyle the veterinary shell and shared EHR controls with the same premium system, using deep green with dusty blue for clinical hierarchy.
- Retain the phone-first clinical workflow and every existing dashboard, patient, appointment, examination, prescription, laboratory, vaccination, inventory, billing, and report feature.
- Replace cramped wide-table presentation with phone-safe rows where necessary, without changing the underlying data or actions.

## Validation
- Confirm all routes compile and no links or role guards regress.
- Test representative owner, auth, sensor, clinic, community, report, settings, and veterinary screens at 360px, 390px, and 430px widths.
- Verify dialogs/sheets stay inside the phone frame, text does not clip, bottom navigation remains usable, and reduced-motion preferences are respected.

## Technical notes
- Centralize styling in `src/styles.css` and reusable shared components before applying focused route-level visual updates.
- Keep TanStack Router, React state, query caching, server functions, and all current data contracts unchanged.
- Replace hardcoded visual values in touched components with semantic tokens; do not alter business logic.
