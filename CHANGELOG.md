# Changelog

All meaningful changes to this project should be documented in this
file.

This changelog is intended to provide a concise operational history of
the project. Detailed release notes, implementation records, and
historical material may live under `docs/releases/` and `docs/history/`.

## Format

Use version headings when the project has formal releases:

``` text
## [1.2.0] - YYYY-MM-DD
```

For projects that are not formally versioned, use dated release
headings:

``` text
## YYYY-MM-DD
```

Within each release, use only the categories that apply:

-   **Added** --- new features or capabilities
-   **Changed** --- changes to existing behavior
-   **Fixed** --- defect corrections
-   **Removed** --- removed features or behavior
-   **Deprecated** --- functionality planned for removal
-   **Security** --- security-related changes
-   **Documentation** --- meaningful documentation changes
-   **Operations** --- deployment, monitoring, backup, or administrative
    changes

Do not create empty categories merely for consistency.

------------------------------------------------------------------------

## \[Unreleased\]

### Added

-   `[NEW FEATURE OR CAPABILITY]`

### Changed

-   `[MEANINGFUL CHANGE]`

### Fixed

-   `[DEFECT CORRECTION]`

Remove unused categories before committing.

------------------------------------------------------------------------

## \[0.1.0\] - YYYY-MM-DD

### Added

-   Initial project structure.
-   Initial project documentation.

------------------------------------------------------------------------

## Entry Guidelines

Write changelog entries for people who need to understand what
materially changed.

Prefer:

``` text
- Added CSV import validation for required customer fields.
```

Instead of:

``` text
- Updated files.
```

Prefer:

``` text
- Changed production deployment to run database migrations before application release.
```

Instead of:

``` text
- Deployment changes.
```

A changelog entry should describe the effect of the change, not merely
the implementation activity.

## What Belongs Here

Include changes such as:

-   New user-facing capabilities
-   Meaningful workflow changes
-   Significant bug fixes
-   Database/schema changes
-   Integration changes
-   Authentication or authorization changes
-   Security improvements
-   Production deployment changes
-   Important operational changes
-   Removed or deprecated functionality
-   Major documentation changes that affect operation or maintenance

## What Usually Does Not Belong Here

Routine development noise generally does not need a changelog entry,
including:

-   Formatting-only changes
-   Minor comment edits
-   Dependency lockfile churn with no meaningful operational effect
-   Temporary debugging changes
-   Intermediate commits already represented by a meaningful final entry
-   Routine refactoring with no external or operational effect

Git history remains the detailed record of individual commits.

## Release Documentation

If a release requires more detail than is appropriate here, create a
release document under:

``` text
docs/releases/
```

Recommended filename:

``` text
YYYY-MM-DD-vX.Y.Z.md
```

Then reference it from the relevant changelog entry when useful.

## Breaking Changes

Clearly identify changes that require manual action, migration,
configuration updates, or changes in expected behavior.

Example:

``` text
### Changed

- **BREAKING:** Renamed `OLD_VARIABLE` to `NEW_VARIABLE`. Production and local environment configuration must be updated before deployment.
```

Document the required migration or operational procedure under the
appropriate `docs/` section.

## Database Changes

For schema or migration changes, describe the operational effect without
copying migration implementation details into this file.

Example:

``` text
### Changed

- Added status history tracking to work orders. Apply database migration `20260916_add_work_order_status_history` before deploying the release.
```

Executable migrations remain in the location required by the project's
database tooling.

## Security Changes

Describe security improvements without exposing exploitable
implementation details or secret values.

Example:

``` text
### Security

- Restricted administrative actions to authorized roles and added server-side permission validation.
```

Never place passwords, API keys, tokens, private keys, recovery codes,
or other secrets in the changelog.

## Documentation Changes

Record documentation changes when they materially affect how the project
is deployed, operated, recovered, maintained, or understood.

Example:

``` text
### Documentation

- Added production recovery procedure under `docs/operations/`.
```

Minor wording or formatting changes do not require changelog entries.

## Release Finalization

Before finalizing a release:

1.  Review the `[Unreleased]` section.
2.  Remove empty categories.
3.  Move release entries under the new version/date heading.
4.  Add the release date.
5.  Confirm any breaking changes or migrations are explicit.
6.  Confirm related operational documentation is current.
7.  Leave a clean `[Unreleased]` section for future work.

------------------------------------------------------------------------

## Changelog Principle

The changelog is the concise history of changes that matter.

Git records every commit. The changelog records the changes a
maintainer, operator, or stakeholder is likely to care about.
