# Changes

## Web 1.1.3
- Category management shows every first-level category in independently expandable cards.
- Defaults to collapsed on entry; retains edit, add, delete and note mapping.
- Plugin remains 1.1.2; storage schema and protocol unchanged.

## Maintenance phase 1 — production rollout approved
- Separate web and plugin sources; retain application and plugin version 1.1.2.
- Add Node regression tests and web-only static artifact checks.
- Add CI checks on development branches; Pages deployment restricted to main after successful tests.
- Generate per-commit SW cache ID and release.json for traceability.
- Keep plugin download pinned to the original 1.1.2 repository artifact pending phase-two Releases.

## Baseline — web 1.1.2 / plugin 1.1.2
Stable source: 28ef24031c11fbd9aa0aacbf1fec1e4fa49068ce.
GitHub Pages callback compatibility; old site callback compatibility retained.

- Update checkout/setup-node/deploy-pages to Node 24 action runtimes. Test runtime remains Node 22.
- upload-pages-artifact v4 internally pins upload-artifact v4.6.2 (Node 20 metadata); any runner compatibility warning is an upstream dependency warning, not a data migration. Keep this documented pending upstream update.
