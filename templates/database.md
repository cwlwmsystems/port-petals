# Database --- \[Project Name\]

> Cwlwm Systems database documentation template. Use this document to
> explain the project's database architecture, schema organization,
> migrations, access model, backup responsibilities, and recovery
> procedures.

## Document Information

  Field          Value
  -------------- ----------------------------------
  Project        `[PROJECT NAME]`
  Database       `[PROVIDER / ENGINE / N/A]`
  Status         `[Draft / Current / Superseded]`
  Owner          `[NAME / ROLE]`
  Last Updated   `[YYYY-MM-DD]`

## Overview

Describe the role of the database in the project.

`[DATABASE OVERVIEW]`

## Platform

  Field                Value
  -------------------- -----------------------------------
  Provider             `[SUPABASE / POSTGRESQL / OTHER]`
  Engine               `[POSTGRESQL / OTHER]`
  Production Project   `[PROJECT REFERENCE / N/A]`
  Region               `[REGION / N/A]`
  Local Development    `[METHOD / N/A]`

Do not record passwords, connection strings containing credentials, API
keys, or other secrets.

## Data Model

Describe the major data domains and relationships.

  Entity / Table   Purpose       Key Relationships
  ---------------- ------------- -------------------
  `[ENTITY]`       `[PURPOSE]`   `[RELATIONSHIPS]`

Detailed schema definitions should remain in executable migrations or
schema files where appropriate.

## Schema Organization

Document important schemas, tables, views, functions, triggers, indexes,
or other database objects.

### Schemas

-   `[SCHEMA]` --- `[PURPOSE]`

### Important Tables

-   `[TABLE]` --- `[PURPOSE]`

### Views / Functions / Triggers

-   `[OBJECT]` --- `[PURPOSE]`

Only document objects that are meaningful to understanding or operating
the project.

## Migrations

**Migration location:** `[PATH]`

Example:

``` text
supabase/migrations/
```

Document the migration workflow:

1.  `[CREATE / GENERATE MIGRATION]`
2.  `[REVIEW MIGRATION]`
3.  `[TEST LOCALLY]`
4.  `[APPLY TO TARGET ENVIRONMENT]`
5.  `[VERIFY RESULT]`

Executable migrations must remain in the location required by the
database tooling. Do not move them into `docs/database/`.

### Migration Rules

-   Treat committed migrations as project history.
-   Review destructive operations carefully before execution.
-   Test migrations in an appropriate non-production environment when
    practical.
-   Document manual production steps when automation is not sufficient.
-   Never embed production credentials in migration files.

## Local Development

Describe how developers run or access the database locally.

``` bash
[LOCAL DATABASE COMMAND]
```

Document:

-   Startup procedure
-   Shutdown procedure
-   Reset procedure
-   Migration application
-   Seed/test-data procedure
-   Required tooling

`[DETAILS]`

Avoid using real production data for local development unless explicitly
authorized and operationally necessary.

## Environments

  ----------------------------------------------------------------------------------------
  Environment       Database / Project    Data Type                      Purpose
  ----------------- --------------------- ------------------------------ -----------------
  Development       `[REFERENCE]`         `[LOCAL / TEST]`               Development

  Preview / Staging `[REFERENCE / N/A]`   `[TEST / SANITIZED / OTHER]`   Verification

  Production        `[REFERENCE]`         `Production`                   Live system
  ----------------------------------------------------------------------------------------

Document important schema or configuration differences between
environments.

## Access and Authorization

Describe how database access is controlled.

  Access Type     Who / What           Permission Level   Method
  --------------- -------------------- ------------------ ------------
  Application     `[SERVICE / ROLE]`   `[PERMISSIONS]`    `[METHOD]`
  Administrator   `[ROLE]`             `[PERMISSIONS]`    `[METHOD]`
  Developer       `[ROLE]`             `[PERMISSIONS]`    `[METHOD]`

Apply least privilege where practical.

If row-level security or equivalent controls are used, document their
purpose and enforcement model.

## Row-Level Security / Data Policies

**Used:** `[Yes / No / N/A]`

Describe:

-   Which data requires policy enforcement
-   Which roles/users may read data
-   Which roles/users may modify data
-   Administrative exceptions
-   Server-side/service access

`[DETAILS]`

Security-sensitive authorization should not rely solely on client-side
application checks.

## Database Configuration

Document configuration categories without secret values.

Environment-variable names belong in:

``` text
.env.example
```

Relevant variables:

-   `[VARIABLE NAME]`
-   `[VARIABLE NAME]`

Real credentials belong in approved credential/provider systems.

## Seed and Test Data

**Seed location:** `[PATH / N/A]`

Describe how test or seed data is created.

`[PROCESS]`

Rules:

-   Do not commit sensitive production data.
-   Prefer synthetic or purpose-built test data.
-   Document any required anonymization/sanitization process.
-   Keep seed procedures repeatable where practical.

## Backup

  Field               Value
  ------------------- -----------------------------------------
  Backup Method       `[PROVIDER / MANUAL / AUTOMATED / N/A]`
  Frequency           `[FREQUENCY / N/A]`
  Retention           `[RETENTION / N/A]`
  Responsible Owner   `[OWNER]`
  Verification        `[HOW BACKUPS ARE VERIFIED]`

Do not assume source control backs up database contents.

## Recovery

Describe the recovery procedure at a high level.

1.  `[IDENTIFY FAILURE / RECOVERY POINT]`
2.  `[RESTORE OR RECREATE DATABASE]`
3.  `[APPLY REQUIRED MIGRATIONS]`
4.  `[RESTORE DATA IF REQUIRED]`
5.  `[VERIFY APPLICATION]`

Detailed operational recovery procedures may belong under:

``` text
docs/operations/
```

## Data Retention

Document project-specific retention requirements.

  Data            Retention Requirement   Removal / Archive Method
  --------------- ----------------------- --------------------------
  `[DATA TYPE]`   `[REQUIREMENT]`         `[METHOD]`

If no formal requirement exists, record that explicitly rather than
inventing one.

## Sensitive Data

Identify categories of sensitive data handled by the database.

-   `[CATEGORY / NONE]`

Document controls and handling requirements without placing actual
sensitive records in documentation.

## Imports and Exports

Document repeatable import/export workflows when they are operationally
important.

  Workflow       Input / Output   Location             Procedure
  -------------- ---------------- -------------------- ---------------
  `[WORKFLOW]`   `[TYPE]`         `[PATH / SERVICE]`   `[REFERENCE]`

Temporary exports containing production or client data should not remain
in Downloads or other unmanaged locations.

## Performance

Document important indexes, query considerations, provider limits, or
known bottlenecks.

-   `[CONSIDERATION / NONE]`

Do not optimize speculatively without a demonstrated need.

## Monitoring and Maintenance

Document routine database checks where applicable.

-   `[BACKUP CHECK]`
-   `[MIGRATION CHECK]`
-   `[PERFORMANCE / STORAGE CHECK]`
-   `[SECURITY / ACCESS REVIEW]`

## Troubleshooting

Database-specific troubleshooting documents belong under:

``` text
docs/troubleshooting/
```

Common issues worth documenting include:

-   Migration failures
-   Connection failures
-   Permission/RLS failures
-   Data-integrity problems
-   Provider outages
-   Backup/recovery problems

## Database Decisions

Significant database decisions should be recorded under:

``` text
docs/decisions/
```

  Decision       Reference
  -------------- ------------------------------------
  `[DECISION]`   `[docs/decisions/DEC-###-name.md]`

## Known Limitations

-   `[LIMITATION / NONE]`

## Related Documentation

  Topic              Location
  ------------------ -------------------------
  Project Overview   `README.md`
  Architecture       `docs/architecture/`
  Deployment         `docs/deployment/`
  Operations         `docs/operations/`
  Troubleshooting    `docs/troubleshooting/`
  Decisions          `docs/decisions/`

------------------------------------------------------------------------

## Database Documentation Principle

Database documentation should make schema ownership, migrations, access
controls, backup responsibilities, recovery, and data handling
understandable without duplicating executable database definitions or
exposing credentials.
