# Database Design

This document defines the PostgreSQL-first schema for the initial backend foundation. PostgreSQL is the source of truth. Production SQL must not be shaped around H2 compatibility.

## Scope

Initial schema coverage:

- Roles
- Admin users
- Classrooms
- School registrations

The first migrations should support these tables and the relationships between them. Later content types such as schedules, activities, and announcements can extend this model.

## Tables and Relationships

### `roles`

Stores the application roles assigned to admin users.

- One role can be assigned to many admin users.
- Role names should be stable and unique.

### `admin_users`

Stores authenticated administrative accounts.

- User records should support soft deletion or deactivation.

### `admin_user_roles`

Stores the many-to-many assignment between admin users and roles.

- Each row belongs to one admin user and one role.
- Deleting an admin user or role should remove only the join row, not the parent row.

### `classrooms`

Stores the available school classrooms or levels.

- One classroom can be referenced by many school registrations.
- Classrooms should be treated as reference data with unique stable identifiers.

### `school_registrations`

Stores public school registration submissions.

- Each registration belongs to one classroom.
- Registrations should never expose the internal primary key to the frontend.
- A separate public reference should be generated for user-facing confirmation.

## PostgreSQL Data Types

- Primary keys: `uuid`
- Public references: `text` or `varchar` with a unique index
- Short codes and slugs: `text`
- Names and labels: `text`
- Booleans: `boolean`
- Dates: `date`
- Timestamps: `timestamptz`
- Enumerated state fields: PostgreSQL enum types or constrained `text`
- Long free-text content: `text`
- Contact values: `text`

## UUID Strategy

- Use database-generated UUIDs for internal primary keys.
- Prefer PostgreSQL `uuid` values with `gen_random_uuid()` or an equivalent application-level UUID generator.
- Public references should be separate from internal IDs and should not leak database row counts or ordering.
- Seeded system rows may use stable, documented UUIDs to keep repeatable migrations and integration tests deterministic.

## Enum Storage Strategy

- Use `text` or `varchar` with a `CHECK` constraint for the registration status field.
- Keep role names as stable text values.
- Avoid PostgreSQL enum types for the initial schema so future state additions can be migrated with less risk.

## Foreign Keys

- `admin_users.role_id` should reference `roles.id`.
- `school_registrations.classroom_id` should reference `classrooms.id`.
- Foreign key deletes should be chosen deliberately and never silently remove personal data without an explicit business reason.

## Unique Constraints

- `roles.name` must be unique.
- `admin_users.email` must be unique.
- `classrooms.name` must be unique.
- `school_registrations.public_reference` must be unique.

## Check Constraints

- Role names must not be empty.
- Email addresses must not be empty.
- Classroom identifiers must be positive and non-empty.
- Registration consent must be explicitly accepted.
- Status or visibility fields must only allow known values.
- Registration status should be constrained to `PENDING`, `APPROVED`, `REJECTED`, and `WAITLISTED`.

## Indexes

- Add an index on `admin_users.role_id`.
- Add an index on `admin_user_roles.admin_user_id`.
- Add an index on `admin_user_roles.role_id`.
- Add an index on `school_registrations.classroom_id`.
- Add an index on `school_registrations.public_reference`.
- Add lookup indexes for timestamps used in admin filtering and retention.
- Add uniqueness-enforcing indexes where required.

## Delete and Anonymization Behavior

- Admin users should normally be deactivated rather than hard-deleted.
- Deleting an admin user should only remove role assignments and optionally null out review references, not registration history.
- School registrations should be retained according to legal and organizational requirements.
- If a registration must be removed, anonymize personal-contact fields instead of deleting the entire row when auditability must be preserved.
- Hard delete should be reserved for records that are explicitly safe to remove.

## Personal-Data Fields

School registration rows may store personal data such as:

- Child name
- Child date of birth or age band, if required later
- Parent or guardian name
- Parent or guardian email
- Parent or guardian phone number
- Notes or needs disclosures, if approved by policy

These fields should be treated as sensitive and minimized to the smallest set needed by the business process.

## Audit Fields

All mutable tables should include:

- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- Optional `created_by` and `updated_by` references for administrative changes

For public registrations, consider separate processing metadata such as submission IP or user agent only if there is a documented need.

## Retention Considerations

- Keep public registration data only as long as the organization needs it for school administration, compliance, and operational follow-up.
- Separate archival policy from operational tables when the data volume grows.
- If legal retention requirements change, prefer anonymization or archival export over ad-hoc manual deletion.

## Implementation Notes

- Keep the initial migration small and explicit.
- Avoid relying on Hibernate schema generation for production data structures.
- Keep PostgreSQL as the authoritative schema definition and let tests reflect that reality.
- Use stable UUIDs for the seeded `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`, and classroom rows so repeated migrations are deterministic.