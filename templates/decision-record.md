# Decision Record --- \[Decision Title\]

> Cwlwm Systems technical decision record template. Use this document
> for significant project decisions whose context, alternatives, and
> consequences should remain understandable after the implementation
> details have changed.

## Decision Information

  Field           Value
  --------------- -------------------------------------------------
  Project         `[PROJECT NAME]`
  Decision ID     `DEC-[###]`
  Status          `[Proposed / Accepted / Superseded / Rejected]`
  Date            `[YYYY-MM-DD]`
  Owner           `[NAME / ROLE]`
  Supersedes      `[DEC-### / N/A]`
  Superseded By   `[DEC-### / N/A]`

## Decision

State the decision clearly and concisely.

`[DECISION]`

A reader should be able to understand what was decided without reading
the rest of the document.

## Context

Describe the situation that required a decision.

Include only context relevant to understanding the choice.

`[CONTEXT]`

## Problem / Need

What technical, operational, security, product, or business need does
this decision address?

`[PROBLEM OR NEED]`

## Constraints

Document constraints that materially affected the decision.

-   `[TECHNICAL CONSTRAINT]`
-   `[BUSINESS CONSTRAINT]`
-   `[SECURITY / DATA CONSTRAINT]`
-   `[COST / TIME CONSTRAINT]`
-   `[EXISTING PLATFORM CONSTRAINT]`

Remove items that do not apply.

## Decision Drivers

What factors mattered most?

-   `[MAINTAINABILITY]`
-   `[RELIABILITY]`
-   `[SECURITY]`
-   `[SIMPLICITY]`
-   `[COMPATIBILITY]`
-   `[COST]`
-   `[DELIVERY TIME]`
-   `[OTHER]`

Do not invent criteria that were not actually part of the decision.

## Options Considered

### Option A --- `[OPTION]`

**Description**

`[DESCRIPTION]`

**Advantages**

-   `[ADVANTAGE]`

**Disadvantages / Tradeoffs**

-   `[DISADVANTAGE]`

### Option B --- `[OPTION]`

**Description**

`[DESCRIPTION]`

**Advantages**

-   `[ADVANTAGE]`

**Disadvantages / Tradeoffs**

-   `[DISADVANTAGE]`

### Option C --- `[OPTION / REMOVE IF NOT NEEDED]`

**Description**

`[DESCRIPTION]`

**Advantages**

-   `[ADVANTAGE]`

**Disadvantages / Tradeoffs**

-   `[DISADVANTAGE]`

## Rationale

Explain why the selected option best addressed the actual decision
drivers and constraints at the time.

`[RATIONALE]`

The purpose is to preserve reasoning, not to prove that the choice was
universally optimal.

## Consequences

### Positive

-   `[CONSEQUENCE]`

### Negative / Tradeoffs

-   `[CONSEQUENCE]`

### Neutral / Operational

-   `[CONSEQUENCE]`

Document meaningful consequences even when they are inconvenient.

## Implementation Impact

Identify areas affected by the decision.

  Area               Impact
  ------------------ -------------------
  Application Code   `[IMPACT / NONE]`
  Database           `[IMPACT / NONE]`
  Deployment         `[IMPACT / NONE]`
  Operations         `[IMPACT / NONE]`
  Security           `[IMPACT / NONE]`
  Documentation      `[IMPACT / NONE]`

## Required Follow-Up

  Action       Owner       Status
  ------------ ----------- ---------------------
  `[ACTION]`   `[OWNER]`   `[Open / Complete]`

If no follow-up is required, state:

`No additional follow-up required.`

## Validation

How will Cwlwm know the decision is working as intended?

-   `[VALIDATION METHOD]`
-   `[EXPECTED RESULT]`

## Revisit Triggers

Document conditions that should cause this decision to be reconsidered.

-   `[SIGNIFICANT SCALE CHANGE]`
-   `[PROVIDER / PLATFORM CHANGE]`
-   `[SECURITY REQUIREMENT CHANGE]`
-   `[COST CHANGE]`
-   `[NEW PRODUCT REQUIREMENT]`

Only retain triggers that are relevant.

## Related References

  Reference               Location / Identifier
  ----------------------- ---------------------------------
  Architecture            `[docs/architecture/... / N/A]`
  Database                `[docs/database/... / N/A]`
  Deployment              `[docs/deployment/... / N/A]`
  Planning                `[docs/planning/... / N/A]`
  Issue / Requirement     `[REFERENCE / N/A]`
  Commit / Pull Request   `[REFERENCE / N/A]`

## Supersession

If this decision is replaced later:

1.  Keep this record in the repository.
2.  Change its status to `Superseded`.
3.  Add the replacement decision under **Superseded By**.
4.  Create a new decision record explaining the new context and
    decision.

Do not rewrite historical decision records to make old reasoning appear
current.

------------------------------------------------------------------------

## Filing

Recommended filename:

``` text
DEC-###-short-decision-name.md
```

Recommended location:

``` text
docs/decisions/
```

Examples:

``` text
docs/decisions/DEC-001-use-supabase-for-application-data.md
docs/decisions/DEC-002-deploy-production-on-vercel.md
docs/decisions/DEC-003-use-server-side-authorization.md
```

Use decision records for choices that materially affect architecture,
data, security, deployment, operations, maintainability, or future
development. Routine implementation details do not need permanent
decision records.

## Decision Record Principle

A technical decision record preserves why a meaningful choice was made,
what alternatives were considered, and what consequences were accepted.

Future maintainers should be able to evaluate the decision in its
original context instead of reconstructing the reasoning from code
history.
