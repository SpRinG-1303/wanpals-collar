# Pawsitive Diagnostics dog-only update

## Scope
- Replace every visible `MOooMENTUM` brand reference and page metadata with `Pawsitive Diagnostics`.
- Keep the existing pet-parent and veterinarian login choices, but remove the species-selection step from sign-up and guest entry.
- Make dog the only supported pet type throughout owner-facing screens, profiles, facts, breeds, community, Pet Match, reports, and collar copy.
- Simplify multi-pet management so users can still add and switch between multiple dogs without choosing an animal type.
- Remove non-dog species datasets, imports, images, and conditional interface branches that are no longer needed.
- Preserve current routes, sensor integrations, maps, translations, role-specific veterinarian experience, and all existing functionality unrelated to species selection.

## Technical details
- Normalize previously saved pet profiles to `dog` during hydration so old cow, buffalo, goat, sheep, or cat selections cannot continue appearing.
- Collapse shared species helpers to a single dog profile where existing screens still depend on breed, facts, temperature range, or image metadata.
- Update community and Pet Match sources to dog-only data rather than leaving unreachable non-dog variants.
- Audit all source files for old branding and non-dog user-facing content, then verify the login, guest, home, community, and settings flows in the phone frame.
