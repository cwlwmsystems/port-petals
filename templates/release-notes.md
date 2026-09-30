# Release Notes --- \[Project Name\] v\[X.Y.Z\]

> Cwlwm Systems release-notes template. Use this document when a release
> needs more operational or implementation detail than belongs in
> `CHANGELOG.md`.

## Release Information

  Field              Value
  ------------------ --------------------------------------
  Project            `[PROJECT NAME]`
  Version            `v[X.Y.Z]`
  Release Date       `[YYYY-MM-DD]`
  Status             `[Planned / Released / Rolled Back]`
  Owner              `[NAME / ROLE]`
  Production URL     `[URL / N/A]`
  Source Reference   `[TAG / COMMIT / BRANCH]`

## Summary

Describe the purpose of this release in a few sentences.

`[RELEASE SUMMARY]`

## Release Scope

### Added

-   `[FEATURE / CAPABILITY]`

### Changed

-   `[CHANGE]`

### Fixed

-   `[FIX]`

### Removed

-   `[REMOVAL / NONE]`

### Security

-   `[SECURITY CHANGE / NONE]`

Remove empty categories when appropriate.

## User / Business Impact

Describe meaningful changes visible to users, operators, clients, or the
business.

`[IMPACT / NONE]`

## Technical Changes

Document significant implementation changes that future maintainers
should understand.

-   `[APPLICATION CHANGE]`
-   `[ARCHITECTURE CHANGE]`
-   `[INTEGRATION CHANGE]`
-   `[CONFIGURATION CHANGE]`

Routine code-level details normally belong in source control rather than
release notes.

## Database Changes

**Database changes included:** `[Yes / No]`

If yes:

  Item                     Reference / Description
  ------------------------ -------------------------
  Migration                `[MIGRATION FILE / ID]`
  Schema Change            `[DESCRIPTION]`
  Data Migration           `[DESCRIPTION / N/A]`
  Rollback Consideration   `[DETAILS]`

Document any required migration ordering or production precautions.

## Configuration Changes

**Configuration changes required:** `[Yes / No]`

If yes, document variable names or provider settings only.

-   `[VARIABLE / SETTING NAME]` --- `[PURPOSE]`

Never include secret values.

Ensure required variable names are reflected in `.env.example`.

## Deployment

**Deployment method:** `[AUTOMATIC / MANUAL / OTHER]`

Reference the deployment procedure:

``` text
docs/deployment/[FILE].md
```

### Release-Specific Deployment Steps

1.  `[STEP / NONE]`
2.  `[STEP]`
3.  `[VERIFY]`

Only include steps unique to this release.

## Pre-Release Validation

-   [ ] Required tests/checks pass.
-   [ ] Production configuration is ready.
-   [ ] Database migrations are reviewed where applicable.
-   [ ] Documentation is updated.
-   [ ] Backup/recovery considerations are understood where applicable.
-   [ ] Release contents match the intended scope.

Project-specific checks:

-   [ ] `[CHECK]`

## Post-Deployment Verification

-   [ ] Production URL responds.
-   [ ] Critical workflow `[WORKFLOW]` succeeds.
-   [ ] Authentication works where applicable.
-   [ ] Database operations work where applicable.
-   [ ] Critical integrations work.
-   [ ] No new critical production error is present.

Additional checks:

-   [ ] `[CHECK]`

## Known Issues

  ---------------------------------------------------------------------------------------------
  Issue                   Impact                  Workaround / Reference
  ----------------------- ----------------------- ---------------------------------------------
  `[ISSUE / NONE]`        `[IMPACT]`              `[WORKAROUND OR docs/troubleshooting/... ]`

  ---------------------------------------------------------------------------------------------

Do not hide known production limitations that materially affect
operation or users.

## Rollback Considerations

Describe anything release-specific that affects rollback.

`[ROLLBACK DETAILS / STANDARD DEPLOYMENT ROLLBACK APPLIES]`

If database changes are not safely reversible, state that explicitly.

## Documentation Updated

-   [ ] `README.md`
-   [ ] `CHANGELOG.md`
-   [ ] `.env.example`
-   [ ] `docs/architecture/` if architecture changed
-   [ ] `docs/database/` if database behavior changed
-   [ ] `docs/deployment/` if deployment changed
-   [ ] `docs/operations/` if operations changed
-   [ ] `docs/troubleshooting/` if a repeatable issue/fix was identified
-   [ ] `docs/decisions/` if a significant technical decision was made

Check only what actually applies.

## Related References

  Reference           Location / Identifier
  ------------------- ------------------------------------
  Changelog           `CHANGELOG.md`
  Commit / Tag        `[REFERENCE]`
  Pull Request        `[REFERENCE / N/A]`
  Decision Record     `[docs/decisions/... / N/A]`
  Planning Document   `[docs/planning/... / N/A]`
  Troubleshooting     `[docs/troubleshooting/... / N/A]`

## Follow-Up

  Action              Owner       Status
  ------------------- ----------- ---------------------
  `[ACTION / NONE]`   `[OWNER]`   `[Open / Complete]`

## Release Result

**Result:** `[Successful / Rolled Back / Partial / Other]`

`[FINAL RELEASE NOTES]`

------------------------------------------------------------------------

## Filing

Recommended filename:

``` text
YYYY-MM-DD-vX.Y.Z.md
```

Recommended location:

``` text
docs/releases/
```

Example:

``` text
docs/releases/2026-09-16-v1.2.0.md
```

Use `CHANGELOG.md` for concise chronological project history. Use a
release-notes document when a particular release needs additional
deployment, migration, verification, known-issue, or operational
context.

## Release Documentation Principle

Release documentation should make it clear what changed, what production
impact was expected, what special deployment or migration work was
required, and how the release was verified.

Keep the changelog concise; preserve deeper release-specific context
here when it will matter later.
