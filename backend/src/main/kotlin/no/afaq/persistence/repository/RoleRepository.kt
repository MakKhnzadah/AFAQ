package no.afaq.persistence.repository

import no.afaq.persistence.entity.RoleEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional
import java.util.UUID

interface RoleRepository : JpaRepository<RoleEntity, UUID> {
    fun findByName(name: String): RoleEntity?
}