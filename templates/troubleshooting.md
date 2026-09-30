# Troubleshooting --- \[Issue Name\]

> Cwlwm Systems troubleshooting template. Use one document per
> meaningful, repeatable problem when preserving the diagnosis and
> resolution will help future maintenance.

## Issue Information

  Field            Value
  ---------------- -----------------------------------------------
  Project          `[PROJECT NAME]`
  Issue            `[SHORT ISSUE NAME]`
  Status           `[Open / Resolved / Workaround / Monitoring]`
  Environment      `[Development / Preview / Production / All]`
  First Observed   `[YYYY-MM-DD / UNKNOWN]`
  Last Verified    `[YYYY-MM-DD]`
  Owner            `[NAME / ROLE]`

## Summary

Describe the problem in one or two sentences.

`[ISSUE SUMMARY]`

## Symptoms

Record what is actually observed.

-   `[ERROR MESSAGE / BEHAVIOR]`
-   `[AFFECTED WORKFLOW]`
-   `[VISIBLE IMPACT]`

When useful, include a short sanitized error excerpt.

Do not paste credentials, tokens, private data, or unnecessarily large
logs into this document.

## Impact

Describe what the issue prevents or degrades.

`[IMPACT]`

**Severity:** `[Low / Medium / High / Critical]`

Use severity to describe operational impact, not frustration or
debugging difficulty.

## Conditions

Document when the problem occurs.

  Condition                      Value
  ------------------------------ -------------------------
  Environment                    `[ENVIRONMENT]`
  Browser / Runtime              `[VALUE / N/A]`
  Application Version / Commit   `[REFERENCE / UNKNOWN]`
  Database State / Migration     `[REFERENCE / N/A]`
  Provider / Integration         `[REFERENCE / N/A]`

## Reproduction

If the problem can be reproduced safely:

1.  `[STEP]`
2.  `[STEP]`
3.  `[OBSERVED RESULT]`

**Expected result:** `[EXPECTED RESULT]`

**Actual result:** `[ACTUAL RESULT]`

Do not reproduce a destructive production problem merely to complete
this section.

## Initial Checks

Before making changes, verify the obvious dependencies.

-   [ ] Correct environment is being tested.
-   [ ] Application configuration is present.
-   [ ] Required service/provider is available.
-   [ ] Relevant database migration is applied.
-   [ ] User/account has expected permissions.
-   [ ] Recent deployment or configuration changes have been reviewed.

Add issue-specific checks:

-   [ ] `[CHECK]`

## Diagnosis

Record the investigation in a useful sequence.

### Check 1 --- `[CHECK]`

**Command / Location**

``` bash
[SAFE DIAGNOSTIC COMMAND / N/A]
```

**Result**

`[RESULT]`

**Interpretation**

`[WHAT THIS RESULT MEANS]`

### Check 2 --- `[CHECK]`

**Command / Location**

``` bash
[SAFE DIAGNOSTIC COMMAND / N/A]
```

**Result**

`[RESULT]`

**Interpretation**

`[WHAT THIS RESULT MEANS]`

Only retain diagnostic steps that help explain or reproduce the
resolution.

## Root Cause

If known:

`[ROOT CAUSE]`

If the root cause is not confirmed, state:

`Root cause not confirmed.`

Do not present a guess as a confirmed cause.

## Resolution

Describe the confirmed fix.

1.  `[STEP]`
2.  `[STEP]`
3.  `[VERIFY RESULT]`

### Commands

``` bash
[COMMANDS / N/A]
```

Review commands before running them in production, especially commands
that modify or delete data.

## Verification

Confirm the issue is actually resolved.

-   [ ] Original symptom no longer occurs.
-   [ ] Expected workflow succeeds.
-   [ ] No obvious regression is present.
-   [ ] Production was verified if production was affected.

Additional verification:

-   `[CHECK]`

## Workaround

If a permanent resolution is not yet available:

`[WORKAROUND / N/A]`

Document limitations and risks of the workaround.

## Prevention

Describe changes that reduce the likelihood of recurrence.

-   `[TEST / VALIDATION]`
-   `[DOCUMENTATION UPDATE]`
-   `[MONITORING / ALERT]`
-   `[CONFIGURATION / CODE CHANGE]`

Do not add preventative work that is disproportionate to the actual
risk.

## Related Changes

  Reference      Location / Identifier
  -------------- -------------------------------
  Commit         `[REFERENCE / N/A]`
  Pull Request   `[REFERENCE / N/A]`
  Decision       `[docs/decisions/... / N/A]`
  Release        `[docs/releases/... / N/A]`
  Deployment     `[docs/deployment/... / N/A]`

## Security / Data Considerations

Did this issue involve credentials, unauthorized access, sensitive data,
data loss, or suspected exposure?

`[Yes / No]`

If yes, record only the non-sensitive operational summary here and
follow the appropriate Cwlwm Systems security/incident process.

Never place exposed credentials, recovery codes, tokens, private keys,
or sensitive incident evidence in normal repository documentation.

## Follow-Up

  Action       Owner       Due / Review     Status
  ------------ ----------- ---------------- ---------------------
  `[ACTION]`   `[OWNER]`   `[DATE / N/A]`   `[Open / Complete]`

## History

  Date             Event
  ---------------- ---------------------------------------------
  `[YYYY-MM-DD]`   `[ISSUE OBSERVED / FIX APPLIED / VERIFIED]`

------------------------------------------------------------------------

## Filing

Recommended filename:

``` text
short-descriptive-issue-name.md
```

Recommended location:

``` text
docs/troubleshooting/
```

Examples:

``` text
docs/troubleshooting/vercel-build-fails-on-typecheck.md
docs/troubleshooting/supabase-migration-permission-error.md
docs/troubleshooting/oauth-redirect-mismatch.md
```

Create troubleshooting documentation when the solution is likely to save
meaningful investigation time in the future. Do not create permanent
documentation for every trivial one-time error.

## Troubleshooting Principle

A useful troubleshooting document connects a recognizable symptom to a
reliable diagnosis and verified resolution.

Preserve what future maintainers need to solve the problem again, while
keeping secrets and sensitive incident data out of the repository.
