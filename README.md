# Grace’s Voice

Canonical source: https://github.com/graceautoman-ui/graces-voice
Website: https://graceautoman-ui.github.io/graces-voice/

## Development

Use latest main and a temporary branch. Node 22 is sufficient; no package installation or framework.

```
node --test tests/*.test.cjs
node scripts/build.cjs
```

web/ contains website sources; plugin/ contains Obsidian plugin source. tests/ uses synthetic fixtures only. dist/ is generated, ignored, and is the only Pages upload directory. versions.json tracks independent web/plugin versions. CHANGELOG records releases. Do not upload Vaults or browser backups.

Current plugin download points to the immutable original repository commit, retaining installation functionality without deploying plugin code on Pages. GitHub Release packaging and PWA update notifications are phase two.

## First activation — only after approval

The present production site uses the existing branch-based publisher. Do not merge this branch while that publisher still serves main root: the files move to web/.

After user approval: change Settings → Pages → Source to GitHub Actions; then merge this reviewed branch into main. CI tests and creates a web-only artifact, then deploys. Development branches and PRs never deploy. Switching the source itself must not be done during phase-one preparation. Confirm main has not moved before merging.

For future work: requirement → latest code → branch → tests → user confirmation → merge → automatic Pages deployment. GitHub write authorization is required; never substitute ZIP uploads as the maintenance workflow.

## Versions and data

Application code remains 1.1.2 in phase one; cache artifact IDs include the full Git commit so each build updates static assets. This is not the phase-two update prompt. Existing workers wait for old tabs to close. No IndexedDB migration or deletion is introduced.

Future web changes increment web version and visible version strings; plugin changes increment plugin manifest and plugin version only. CI checks version agreement. A rollback creates a new commit, hence a fresh cache ID even when restoring older web code.

## Rollback (approval required)

If CI fails before deployment the previous Pages deployment remains. For a bad released version, create a rollback branch from latest main, restore only web/ and the web version from the last stable structured-layout commit, run tests/build, review and merge after approval. Do not reset or force-push main; do not revert the entire repository to the pre-layout commit because that also removes the workflow. For the initial transition, restore the baseline website files from commit 28ef240 into web/ using a temporary checkout, exclude plugin ZIP and docs, retain the new workflow/build tooling and pin plugin download link as currently done.

Record each successful release commit in CHANGELOG; retain release artifacts/commits. New build generates a distinct cache ID. Clients need network and reload/closed tabs to receive rollback. Never clear user storage. If a future schema change is incompatible, use a forward fix rather than blind downgrade. Plugin rollback is separate and requires device installation; it never follows a website rollback automatically.

For stable commits using this new directory layout, `node scripts/restore-web.cjs <stable-commit-sha>` prepares a local rollback on a clean temporary branch; it refuses main and does not push or deploy. The original root-layout baseline requires the first-transition procedure above.
