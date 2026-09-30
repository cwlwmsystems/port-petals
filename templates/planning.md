# Planning --- \[Project Name / Initiative\]

> Cwlwm Systems project-planning template. Use this document for a
> defined body of future work that needs enough context, scope,
> sequencing, and acceptance criteria to guide implementation.

## Document Information

  -------------------------------------------------------------------------------------------------------------
  Field                               Value
  ----------------------------------- -------------------------------------------------------------------------
  Project                             `[PROJECT NAME]`

  Initiative                          `[INITIATIVE / FEATURE / MILESTONE]`

  Status                              `[Proposed / Approved / In Progress / Complete / Deferred / Cancelled]`

  Owner                               `[NAME / ROLE]`

  Created                             `[YYYY-MM-DD]`

  Last Updated                        `[YYYY-MM-DD]`

  Target                              `[DATE / VERSION / MILESTONE / N/A]`
  -------------------------------------------------------------------------------------------------------------

## Objective

State what this work is intended to accomplish.

`[OBJECTIVE]`

## Context

Explain why the work is being considered now and what existing project
state matters.

`[CONTEXT]`

## Problem / Opportunity

Describe the problem being solved or opportunity being pursued.

`[PROBLEM OR OPPORTUNITY]`

## Desired Outcome

Describe the state that should exist when this work is complete.

`[DESIRED OUTCOME]`

## Scope

### In Scope

-   `[ITEM]`
-   `[ITEM]`

### Out of Scope

-   `[ITEM]`
-   `[ITEM]`

Keep scope explicit enough to prevent unrelated work from silently
entering the initiative.

## Requirements

  -----------------------------------------------------------------------------------
  ID                Requirement       Priority                  Status
  ----------------- ----------------- ------------------------- ---------------------
  `REQ-001`         `[REQUIREMENT]`   `[Required / Optional]`   `[Open / Complete]`

  -----------------------------------------------------------------------------------

Requirements should describe needed behavior or outcomes rather than
prematurely prescribing implementation.

## Constraints

-   `[TECHNICAL CONSTRAINT]`
-   `[BUSINESS CONSTRAINT]`
-   `[SECURITY / DATA CONSTRAINT]`
-   `[TIME / COST CONSTRAINT]`
-   `[PLATFORM CONSTRAINT]`

Remove constraints that do not apply.

## Assumptions

-   `[ASSUMPTION]`

Validate important assumptions before relying on them for
implementation.

## Dependencies

  -----------------------------------------------------------------------------------------------
  Dependency              Type                                            Status / Requirement
  ----------------------- ----------------------------------------------- -----------------------
  `[DEPENDENCY]`          `[Internal / External / Provider / Decision]`   `[DETAILS]`

  -----------------------------------------------------------------------------------------------

## Proposed Approach

Describe the current implementation approach at a useful level of
detail.

`[PROPOSED APPROACH]`

This section is a plan, not permanent architecture documentation.
Significant architectural choices should receive decision records under
`docs/decisions/`.

## Work Breakdown

### Phase 1 --- `[NAME]`

**Goal:** `[GOAL]`

-   [ ] `[TASK]`
-   [ ] `[TASK]`

**Completion condition:** `[CONDITION]`

### Phase 2 --- `[NAME]`

**Goal:** `[GOAL]`

-   [ ] `[TASK]`
-   [ ] `[TASK]`

**Completion condition:** `[CONDITION]`

Add or remove phases as needed.

## Data / Database Impact

**Database changes expected:** `[Yes / No / Unknown]`

`[SCHEMA / MIGRATION / DATA IMPACT / N/A]`

If the design becomes stable, update the relevant documentation under
`docs/database/`.

## Architecture Impact

**Architecture changes expected:** `[Yes / No / Unknown]`

`[IMPACT / N/A]`

Record significant architectural decisions separately under
`docs/decisions/`.

## Security and Access Impact

Describe changes to authentication, authorization, permissions, secrets,
sensitive data, or trust boundaries.

`[IMPACT / NONE]`

## Deployment / Operations Impact

Describe new configuration, deployment steps, integrations, scheduled
jobs, monitoring, backup, or operational responsibilities.

`[IMPACT / NONE]`

## Risks

  Risk       Impact       Mitigation
  ---------- ------------ ----------------
  `[RISK]`   `[IMPACT]`   `[MITIGATION]`

Document realistic risks, not every imaginable failure.

## Open Questions

-   [ ] `[QUESTION]`
-   [ ] `[QUESTION]`

Resolve material questions before they become undocumented
implementation assumptions.

## Decisions Required

  Decision       Status               Reference
  -------------- -------------------- ------------------------------
  `[DECISION]`   `[Open / Decided]`   `[docs/decisions/... / N/A]`

## Acceptance Criteria

The initiative is complete when:

-   [ ] `[OBSERVABLE RESULT]`
-   [ ] `[OBSERVABLE RESULT]`
-   [ ] Required validation passes.
-   [ ] Relevant documentation is updated.
-   [ ] Production behavior is verified if deployed.

Acceptance criteria should be observable and testable where practical.

## Validation Plan

  Area                Validation
  ------------------- ------------------------
  Application         `[TEST / CHECK]`
  Database            `[TEST / N/A]`
  Security / Access   `[TEST / N/A]`
  Integration         `[TEST / N/A]`
  Production          `[VERIFICATION / N/A]`

## Documentation Impact

Update only the documentation affected by the completed work.

-   [ ] `README.md`
-   [ ] `CHANGELOG.md`
-   [ ] `.env.example`
-   [ ] `docs/architecture/`
-   [ ] `docs/database/`
-   [ ] `docs/deployment/`
-   [ ] `docs/operations/`
-   [ ] `docs/troubleshooting/`
-   [ ] `docs/decisions/`
-   [ ] `docs/releases/`

## Completion Summary

Complete this section when the work finishes.

**Completed:** `[YYYY-MM-DD / N/A]`

**Result**

`[WHAT WAS ACTUALLY DELIVERED]`

**Differences From Plan**

`[MATERIAL DIFFERENCES / NONE]`

**Follow-Up**

-   `[FOLLOW-UP / NONE]`

## Related References

  Reference               Location / Identifier
  ----------------------- ---------------------------------
  Decision Records        `[docs/decisions/... / N/A]`
  Architecture            `[docs/architecture/... / N/A]`
  Database                `[docs/database/... / N/A]`
  Release                 `[docs/releases/... / N/A]`
  Commit / Pull Request   `[REFERENCE / N/A]`

------------------------------------------------------------------------

## Filing

Recommended filename:

``` text
YYYY-MM-DD-short-initiative-name.md
```

Recommended location:

``` text
docs/planning/
```

Example:

``` text
docs/planning/2026-09-16-add-work-order-scheduling.md
```

Keep completed plans when they preserve useful implementation history.
If a plan becomes obsolete before implementation, mark its status rather
than silently rewriting it as though the original plan never existed.

## Planning Documentation Principle

A useful plan defines the intended outcome, boundaries, requirements,
dependencies, sequence, risks, and acceptance criteria before
implementation details become difficult to separate from the original
need.

Planning documentation guides future work; permanent architecture and
operational truth should be updated in their dedicated documentation
after the work is complete.
