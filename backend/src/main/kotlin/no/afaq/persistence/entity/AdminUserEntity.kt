package no.afaq.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import jakarta.persistence.Version
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "admin_users")
class AdminUserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID? = null,

    @Column(name = "email", nullable = false, unique = true, length = 320)
    var email: String = "",

    @Column(name = "password_hash", nullable = false, length = 255)
    var passwordHash: String = "",

    @Column(name = "enabled", nullable = false)
    var enabled: Boolean = true,

    @Column(name = "account_locked", nullable = false)
    var accountLocked: Boolean = false,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.EPOCH,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.EPOCH,

    @Column(name = "last_login_at")
    var lastLoginAt: Instant? = null,

    @Version
    @Column(name = "version", nullable = false)
    var version: Long? = null,
) {

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "admin_user_roles",
        joinColumns = [JoinColumn(name = "admin_user_id", foreignKey = ForeignKey(name = "fk_admin_user_roles_admin_user"))],
        inverseJoinColumns = [JoinColumn(name = "role_id", foreignKey = ForeignKey(name = "fk_admin_user_roles_role"))],
    )
    private val roleEntities: MutableSet<RoleEntity> = linkedSetOf()

    val roles: Set<RoleEntity>
        get() = roleEntities.toSet()

    fun grantRole(role: RoleEntity) {
        roleEntities.add(role)
    }

    fun revokeRole(role: RoleEntity) {
        roleEntities.remove(role)
    }

    @PrePersist
    fun prePersist() {
        normalizeEmail()
        val now = Instant.now()
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