# Implementation Guide --- \[Project Name / Initiative\]

> Cwlwm Systems historical implementation-guide template. Use this
> document when a completed body of work has enough technical detail
> that preserving how it was implemented will help future maintenance,
> migration, recovery, or redesign.

## Document Information

  Field          Value
  -------------- ----------------------------------------
  Project        `[PROJECT NAME]`
  Initiative     `[FEATURE / SYSTEM / MIGRATION]`
  Status         `[Complete / Superseded / Historical]`
  Implemented    `[YYYY-MM-DD]`
  Last Updated   `[YYYY-MM-DD]`
  Owner          `[NAME / ROLE]`
  Release        `[VERSION / N/A]`

## Purpose

Explain what was implemented and why this historical guide is worth
preserving.

`[PURPOSE]`

## Outcome

Describe the final delivered result.

`[IMPLEMENTED OUTCOME]`

Focus on what actually exists, not what the original plan expected to
exist.

## Background

Summarize the relevant project state before implementation.

`[BACKGROUND]`

## Original Planning Reference

  Reference              Location
  ---------------------- ------------------------------
  Planning Document      `[docs/planning/... / N/A]`
  Decision Records       `[docs/decisions/... / N/A]`
  Requirements / Issue   `[REFERENCE / N/A]`

## Implementation Summary

Describe the implementation at a high level.

`[SUMMARY]`

## Components Changed

  Component       Change       Location
  --------------- ------------ --------------------
  `[COMPONENT]`   `[CHANGE]`   `[PATH / SERVICE]`

Include only meaningful components.

## Implementation Sequence

Document the sequence that was actually used.

### Phase 1 --- `[NAME]`

1.  `[STEP]`
2.  `[STEP]`
3.  `[RESULT]`

### Phase 2 --- `[NAME]`

1.  `[STEP]`
2.  `[STEP]`
3.  `[RESULT]`

Add or remove phases as required.

## Application Changes

Describe important application changes.

-   `[CHANGE]`

Reference source paths where useful:

``` text
[path/to/component]
```

Avoid duplicating source code unless a small excerpt is essential to
understanding the implementation.

## Database Changes

**Database changes:** `[Yes / No]`

If yes:

  Item             Reference / Description
  ---------------- -------------------------
  Migration        `[MIGRATION FILE / ID]`
  Schema           `[CHANGE]`
  Data Migration   `[CHANGE / N/A]`
  Policy / RLS     `[CHANGE / N/A]`

Executable migrations remain in the database tooling's required
location.

## Configuration Changes

Document configuration names and purpose, not secret values.

  ----------------------------------------------------------------------------------------------
  Variable / Setting      Purpose                 Environment
  ----------------------- ----------------------- ----------------------------------------------
  `[NAME]`                `[PURPOSE]`             `[Development / Preview / Production / All]`

  ----------------------------------------------------------------------------------------------

Ensure current variable names also appear in `.env.example`.

## Integration Changes

  Integration   Change       Verification
  ------------- ------------ ------------------
  `[SERVICE]`   `[CHANGE]`   `[HOW VERIFIED]`

## Deployment Changes

Describe any deployment work that was unique to this implementation.

`[DETAILS / NONE]`

Permanent deployment procedures belong under `docs/deployment/`.

## Security / Access Changes

Describe changes to authentication, authorization, permissions, trust
boundaries, or sensitive-data handling.

`[DETAILS / NONE]`

Never include credentials, tokens, recovery codes, private keys, or
sensitive incident evidence.

## Problems Encountered

### `[PROBLEM]`

**Symptom**

`[SYMPTOM]`

**Cause**

`[CONFIRMED CAUSE / NOT CONFIRMED]`

**Resolution**

`[RESOLUTION]`

If the problem is likely to recur, create a dedicated guide under
`docs/troubleshooting/` and reference it here.

## Deviations From Plan

Document material differences between the original plan and the final
implementation.

  Planned                 Implemented          Reason
  ----------------------- -------------------- ---------
  `[ORIGINAL APPROACH]`   `[FINAL APPROACH]`   `[WHY]`

If there were no meaningful deviations, state:

`No material deviations from the approved plan.`

## Validation Performed

-   [ ] `[TEST / CHECK]`
-   [ ] `[DATABASE VALIDATION / N/A]`
-   [ ] `[SECURITY / ACCESS VALIDATION / N/A]`
-   [ ] `[INTEGRATION VALIDATION / N/A]`
-   [ ] `[PRODUCTION VERIFICATION / N/A]`

### Result

`[VALIDATION RESULT]`

## Release / Production Result

**Released:** `[Yes / No]`\
**Release:** `[VERSION / DATE / N/A]`

`[PRODUCTION RESULT]`

## Documentation Updated

Record the permanent documentation updated after implementation.

-   `[README.md / N/A]`
-   `[docs/architecture/... / N/A]`
-   `[docs/database/... / N/A]`
-   `[docs/deployment/... / N/A]`
-   `[docs/operations/... / N/A]`
-   `[docs/troubleshooting/... / N/A]`
-   `[docs/decisions/... / N/A]`
-   `[CHANGELOG.md / N/A]`
-   `[docs/releases/... / N/A]`

This historical guide should not become the only source of current
operational truth.

## Known Limitations

-   `[LIMITATION / NONE]`

## Future Considerations

-   `[POSSIBLE FUTURE CHANGE / NONE]`

Do not present speculative future work as committed planning.

## Related References

  Reference               Location / Identifier
  ----------------------- ------------------------------------
  Planning                `[docs/planning/... / N/A]`
  Architecture            `[docs/architecture/... / N/A]`
  Database                `[docs/database/... / N/A]`
  Decision Record         `[docs/decisions/... / N/A]`
  Troubleshooting         `[docs/troubleshooting/... / N/A]`
  Release Notes           `[docs/releases/... / N/A]`
  Commit / Pull Request   `[REFERENCE / N/A]`

## Historical Status

If the implementation is later replaced:

1.  Keep this document as historical context when it remains useful.
2.  Change its status to `Superseded` or `Historical`.
3.  Link to the newer implementation or decision.
4.  Update permanent current-state documentation separately.

Do not rewrite historical implementation documentation to make an old
implementation appear current.

------------------------------------------------------------------------

## Filing

Recommended filename:

``` text
YYYY-MM-DD-short-implementation-name.md
```

Recommended location:

``` text
docs/history/implementation-guides/
```

Example:

``` text
docs/history/implementation-guides/2026-09-16-supabase-auth-implementation.md
```

Not every completed feature needs an implementation guide. Preserve one
when the implementation contains non-obvious sequencing, migration work,
architectural context, operational knowledge, or lessons that would
otherwise be expensive to reconstruct.

## Implementation History Principle

Planning documents describe intended work. Current architecture and
operations documents describe how the system works now. Implementation
guides preserve how significant completed work was actually carried out.

Keeping those roles separate prevents historical detail from being
mistaken for current operational truth.
