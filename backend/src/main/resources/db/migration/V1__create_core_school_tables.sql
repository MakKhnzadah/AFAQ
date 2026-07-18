CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_roles_name UNIQUE (name),
    CONSTRAINT chk_roles_name_not_blank CHECK (btrim(name) <> '')
);

CREATE TABLE admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(320) NOT NULL,
    password_hash varchar(255) NOT NULL,
    enabled boolean NOT NULL DEFAULT true,
    account_locked boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at timestamptz NULL,
    version bigint NOT NULL DEFAULT 0,
    CONSTRAINT uq_admin_users_email UNIQUE (email),
    CONSTRAINT chk_admin_users_email_not_blank CHECK (btrim(email) <> ''),
    CONSTRAINT chk_admin_users_email_lowercase CHECK (email = lower(email)),
    CONSTRAINT chk_admin_users_password_hash_not_blank CHECK (btrim(password_hash) <> '')
);

CREATE TABLE classrooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(120) NOT NULL,
    description text NULL,
    capacity integer NULL,
    active boolean NOT NULL DEFAULT true,
    display_order integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version bigint NOT NULL DEFAULT 0,
    CONSTRAINT uq_classrooms_name UNIQUE (name),
    CONSTRAINT chk_classrooms_name_not_blank CHECK (btrim(name) <> ''),
    CONSTRAINT chk_classrooms_capacity_positive CHECK (capacity IS NULL OR capacity > 0),
    CONSTRAINT chk_classrooms_display_order_non_negative CHECK (display_order >= 0)
);

CREATE INDEX idx_classrooms_active_display_order ON classrooms (active, display_order);

CREATE TABLE admin_user_roles (
    admin_user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_admin_user_roles PRIMARY KEY (admin_user_id, role_id),
    CONSTRAINT fk_admin_user_roles_admin_user FOREIGN KEY (admin_user_id)
        REFERENCES admin_users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_admin_user_roles_role FOREIGN KEY (role_id)
        REFERENCES roles (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_admin_user_roles_role_id ON admin_user_roles (role_id);

CREATE TABLE school_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_reference varchar(64) NOT NULL,
    child_full_name varchar(255) NOT NULL,
    child_date_of_birth date NOT NULL,
    guardian_full_name varchar(255) NOT NULL,
    phone_number varchar(32) NOT NULL,
    email varchar(320) NOT NULL,
    address varchar(255) NOT NULL,
    classroom_id uuid NOT NULL,
    comment varchar(2000) NULL,
    status varchar(20) NOT NULL DEFAULT 'PENDING',
    consent_accepted boolean NOT NULL,
    consent_timestamp timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    privacy_policy_version varchar(50) NOT NULL,
    internal_admin_note varchar(2000) NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamptz NULL,
    reviewed_by_admin_user_id uuid NULL,
    version bigint NOT NULL DEFAULT 0,
    CONSTRAINT uq_school_registrations_public_reference UNIQUE (public_reference),
    CONSTRAINT fk_school_registrations_classroom FOREIGN KEY (classroom_id)
        REFERENCES classrooms (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_school_registrations_reviewed_by_admin_user FOREIGN KEY (reviewed_by_admin_user_id)
        REFERENCES admin_users (id)
        ON DELETE SET NULL,
    CONSTRAINT chk_school_registrations_public_reference_not_blank CHECK (btrim(public_reference) <> ''),
    CONSTRAINT chk_school_registrations_child_full_name_not_blank CHECK (btrim(child_full_name) <> ''),
    CONSTRAINT chk_school_registrations_guardian_full_name_not_blank CHECK (btrim(guardian_full_name) <> ''),
    CONSTRAINT chk_school_registrations_phone_number_not_blank CHECK (btrim(phone_number) <> ''),
    CONSTRAINT chk_school_registrations_email_not_blank CHECK (btrim(email) <> ''),
    CONSTRAINT chk_school_registrations_email_lowercase CHECK (email = lower(email)),
    CONSTRAINT chk_school_registrations_address_not_blank CHECK (btrim(address) <> ''),
    CONSTRAINT chk_school_registrations_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED')),
    CONSTRAINT chk_school_registrations_comment_length CHECK (comment IS NULL OR char_length(comment) <= 2000),
    CONSTRAINT chk_school_registrations_internal_admin_note_length CHECK (internal_admin_note IS NULL OR char_length(internal_admin_note) <= 2000),
    CONSTRAINT chk_school_registrations_privacy_policy_version_not_blank CHECK (btrim(privacy_policy_version) <> ''),
    CONSTRAINT chk_school_registrations_consent_accepted CHECK (consent_accepted)
);

CREATE INDEX idx_school_registrations_classroom_id ON school_registrations (classroom_id);
CREATE INDEX idx_school_registrations_reviewed_by_admin_user_id ON school_registrations (reviewed_by_admin_user_id);
CREATE INDEX idx_school_registrations_status ON school_registrations (status);
CREATE INDEX idx_school_registrations_created_at ON school_registrations (created_at);