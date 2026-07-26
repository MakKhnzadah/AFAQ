CREATE UNIQUE INDEX uq_school_registrations_child_identity
    ON school_registrations (lower(email), lower(child_full_name), child_date_of_birth);
