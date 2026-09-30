# Operations --- \[Project Name\]

> Cwlwm Systems operations documentation template. Use this document for
> the repeatable procedures required to operate, monitor, maintain, and
> recover a live project.

## Document Information

  Field            Value
  ---------------- ----------------------------------
  Project          `[PROJECT NAME]`
  Status           `[Draft / Current / Superseded]`
  Owner            `[NAME / ROLE]`
  Last Updated     `[YYYY-MM-DD]`
  Production URL   `[URL / N/A]`

## Operational Overview

Describe what must be maintained for this project to remain healthy and
usable.

`[OPERATIONAL OVERVIEW]`

## Production Systems

  System           Provider / Location   Purpose       Owner
  ---------------- --------------------- ------------- -----------
  Application      `[PROVIDER]`          `[PURPOSE]`   `[OWNER]`
  Database         `[PROVIDER / N/A]`    `[PURPOSE]`   `[OWNER]`
  Domain / DNS     `[PROVIDER / N/A]`    `[PURPOSE]`   `[OWNER]`
  Authentication   `[PROVIDER / N/A]`    `[PURPOSE]`   `[OWNER]`
  Other            `[PROVIDER / N/A]`    `[PURPOSE]`   `[OWNER]`

Only list systems actually used by the project.

## Routine Operational Checks

### Daily / Frequent

-   `[CHECK / N/A]`

### Weekly

-   `[CHECK / N/A]`

### Monthly

-   `[CHECK / N/A]`

### Periodic

-   `[ACCESS REVIEW / BACKUP TEST / DEPENDENCY REVIEW / OTHER]`

Do not create recurring work that has no operational value.

## Health Verification

Define the minimum checks that demonstrate the production system is
functioning.

-   [ ] Production URL responds.
-   [ ] Critical workflow `[WORKFLOW]` succeeds.
-   [ ] Authentication works where applicable.
-   [ ] Database operations work where applicable.
-   [ ] Critical integrations respond.
-   [ ] No known critical production error is present.

Add project-specific checks:

-   [ ] `[CHECK]`

## Monitoring and Logs

  Source                   Location                  What It Shows
  ------------------------ ------------------------- ---------------
  Application Logs         `[PROVIDER / LOCATION]`   `[PURPOSE]`
  Database Logs            `[PROVIDER / N/A]`        `[PURPOSE]`
  Analytics / Monitoring   `[SERVICE / N/A]`         `[PURPOSE]`
  Other                    `[SERVICE / N/A]`         `[PURPOSE]`

Document how to locate useful operational information without copying
sensitive log contents into this file.

## Administrative Procedures

Document recurring administrative workflows.

### `[PROCEDURE NAME]`

**When:** `[TRIGGER / FREQUENCY]`\
**Required Access:** `[ROLE / SYSTEM]`

1.  `[STEP]`
2.  `[STEP]`
3.  `[VERIFY RESULT]`

Repeat this section for procedures that genuinely require documentation.

## Scheduled Jobs / Automation

  ---------------------------------------------------------------------------
  Job             Schedule /     Platform       Purpose        Failure Impact
                  Trigger                                      
  --------------- -------------- -------------- -------------- --------------
  `[JOB / N/A]`   `[SCHEDULE]`   `[PLATFORM]`   `[PURPOSE]`    `[IMPACT]`

  ---------------------------------------------------------------------------

Document how failures are detected and what action is required.

## Backup Checks

  Component             Backup Method      Verification   Owner
  --------------------- ------------------ -------------- -----------
  Source Code           `[METHOD]`         `[CHECK]`      `[OWNER]`
  Database              `[METHOD / N/A]`   `[CHECK]`      `[OWNER]`
  Other Critical Data   `[METHOD / N/A]`   `[CHECK]`      `[OWNER]`

Source control does not by itself back up production databases or
third-party configuration.

## Recovery Procedures

### Application Recovery

1.  `[IDENTIFY LAST KNOWN GOOD STATE]`
2.  `[RESTORE / REDEPLOY]`
3.  `[RESTORE CONFIGURATION IF REQUIRED]`
4.  `[VERIFY PRODUCTION]`

### Database Recovery

1.  `[IDENTIFY RECOVERY POINT]`
2.  `[RESTORE / RECOVER]`
3.  `[APPLY REQUIRED MIGRATIONS]`
4.  `[VERIFY DATA AND APPLICATION]`

### Configuration Recovery

Describe how required configuration can be restored without embedding
secret values.

`[PROCESS]`

## Access Management

  -------------------------------------------------------------------------
  System            Required Role     Authorized Owner /  Review / Removal
                                      Group               Process
  ----------------- ----------------- ------------------- -----------------
  `[SYSTEM]`        `[ROLE]`          `[OWNER / GROUP]`   `[PROCESS]`

  -------------------------------------------------------------------------

Apply least privilege where practical.

Never record passwords, API keys, private keys, tokens, recovery codes,
or MFA codes here.

## Account / User Administration

If the application has operational user administration, document the
approved workflow.

### Add / Provision Access

1.  `[STEP]`

### Modify Access

1.  `[STEP]`

### Remove / Revoke Access

1.  `[STEP]`

Document authorization requirements before performing privileged
actions.

## Data Operations

Document recurring data procedures such as imports, exports,
corrections, or archival.

  Operation       Procedure / Reference   Authorization Required
  --------------- ----------------------- ------------------------
  `[OPERATION]`   `[REFERENCE]`           `[ROLE / APPROVAL]`

Do not leave sensitive exports in unmanaged locations.

## Maintenance

Document recurring maintenance responsibilities.

-   `[DEPENDENCY UPDATE PROCESS]`
-   `[DATABASE MAINTENANCE]`
-   `[DOMAIN / CERTIFICATE CHECK]`
-   `[INTEGRATION REVIEW]`
-   `[DOCUMENTATION REVIEW]`

## Incident Response

If a production incident occurs:

1.  Identify the affected system and impact.
2.  Preserve useful error/log information.
3.  Stop changes that could increase the impact.
4.  Restore service or reduce impact where practical.
5.  Rotate/revoke credentials if exposure is suspected.
6.  Verify production after remediation.
7.  Record a repeatable technical fix under `docs/troubleshooting/`.
8.  Follow the Cwlwm Systems incident-response process when the event
    has security, client-data, or business impact.

Do not place sensitive incident evidence or exposed credentials in
normal repository documentation.

## Provider Outage

When a third-party provider appears unavailable:

1.  Verify the issue is not limited to the application configuration.
2.  Check the provider's official service status when available.
3.  Determine which project functions are affected.
4.  Avoid unnecessary production changes while the provider is impaired.
5.  Verify the system after service returns.
6.  Document any required follow-up.

## Troubleshooting

Repeatable technical troubleshooting belongs under:

``` text
docs/troubleshooting/
```

Operational documents should link to the relevant troubleshooting guide
rather than duplicating detailed diagnostics.

  Issue       Reference
  ----------- ----------------------------------
  `[ISSUE]`   `[docs/troubleshooting/file.md]`

## Deployment and Release Operations

Deployment procedures belong under:

``` text
docs/deployment/
```

Release history belongs in:

``` text
CHANGELOG.md
```

Detailed release notes belong under:

``` text
docs/releases/
```

## Operational Risks

  Risk       Impact       Mitigation / Response
  ---------- ------------ -----------------------
  `[RISK]`   `[IMPACT]`   `[MITIGATION]`

## Known Operational Limitations

-   `[LIMITATION / NONE]`

## Ownership Changes

If ownership, hosting, database, domain, production URL, or operational
status changes:

-   Update `README.md`.
-   Update the relevant technical documentation.
-   Update the Cwlwm Systems Project Registry.
-   Update the Technology Registry if a Cwlwm-level technology
    relationship changes.

## Related Documentation

  Topic              Location
  ------------------ -------------------------
  Project Overview   `README.md`
  Architecture       `docs/architecture/`
  Database           `docs/database/`
  Deployment         `docs/deployment/`
  Troubleshooting    `docs/troubleshooting/`
  Decisions          `docs/decisions/`
  Releases           `docs/releases/`

------------------------------------------------------------------------

## Operations Documentation Principle

Operational documentation should make routine maintenance and recovery
repeatable.

A maintainer should be able to determine what must be checked, where to
find operational information, how to perform recurring procedures, and
how to recover the system without relying on undocumented memory.
