package no.afaq.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import jakarta.persistence.Version
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

enum class SchoolRegistrationStatus {
    PENDING,
    APPROVED,
    REJECTED,
    WAITLISTED,
}

@Entity
@Table(name = "school_registrations")
class SchoolRegistrationEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID? = null,

    @Column(name = "public_reference", nullable = false, unique = true, length = 64)
    var publicReference: String = "",

    @Column(name = "child_full_name", nullable = false, length = 255)
    var childFullName: String = "",

    @Column(name = "child_date_of_birth", nullable = false)
    var childDateOfBirth: LocalDate? = null,

    @Column(name = "guardian_full_name", nullable = false, length = 255)
    var guardianFullName: String = "",

    @Column(name = "phone_number", nullable = false, length = 32)
    var phoneNumber: String = "",

    @Column(name = "email", nullable = false, length = 320)
    var email: String = "",

    @Column(name = "address", nullable = false, length = 255)
    var address: String = "",

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "classroom_id", nullable = false, foreignKey = ForeignKey(name = "fk_school_registrations_classroom"))
    var classroom: ClassroomEntity? = null,

    @Column(name = "comment", length = 2000)
    var comment: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    var status: SchoolRegistrationStatus = SchoolRegistrationStatus.PENDING,

    @Column(name = "consent_accepted", nullable = false)
    var consentAccepted: Boolean = false,

    @Column(name = "consent_timestamp", nullable = false)
    var consentTimestamp: Instant = Instant.EPOCH,

    @Column(name = "privacy_policy_version", nullable = false, length = 50)
    var privacyPolicyVersion: String = "",

    @Column(name = "internal_admin_note", length = 2000)
    var internalAdminNote: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.EPOCH,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.EPOCH,

    @Column(name = "reviewed_at")
    var reviewedAt: Instant? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_admin_user_id", foreignKey = ForeignKey(name = "fk_school_registrations_reviewed_by_admin_user"))
    var reviewedByAdminUser: AdminUserEntity? = null,

    @Version
    @Column(name = "version", nullable = false)
    var version: Long? = null,
) {

    @PrePersist
    fun prePersist() {
        normalizeEmail()
        val now = Instant.now()
        if (consentTimestamp == Instant.EPOCH) {
            consentTimestamp = now
        }
        if (createdAt == Instant.EPOCH) {
            createdAt = now
        }
        if (updatedAt == Instant.EPOCH) {
            updatedAt = now
        }
    }

    @PreUpdate
    fun preUpdate() {
        normalizeEmail()
        updatedAt = Instant.now()
    }

    private fun normalizeEmail() {
        email = email.trim().lowercase()
    }
}