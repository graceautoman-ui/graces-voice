# Maintenance rules
GitHub main is authoritative. Fetch and branch from latest main for each task. Never use an old ZIP as the source.
Work on temporary branches. Run node --test tests/*.test.cjs and node scripts/build.cjs. Report diff, tests, compatibility and rollback point before asking for release confirmation.
Never merge main, tag a release, change Pages settings or trigger production deployment without the user's explicit approval of the concrete changes. Phase-one authorization permits development-branch work only.
Never access real Vault data or clear IndexedDB. Do not change origin, database names or schema casually. Migration must be incremental and tested.
Only dist generated from web may be deployed. Plugin source lives in plugin; do not put plugin bundles or personal data in web.
Track web and plugin independently in versions.json and CHANGELOG.md. Plugin release automation and update UI are phase two, not implemented yet.
