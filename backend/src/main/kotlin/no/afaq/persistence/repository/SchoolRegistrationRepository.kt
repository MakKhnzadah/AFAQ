package no.afaq.persistence.repository

import no.afaq.persistence.entity.SchoolRegistrationEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SchoolRegistrationRepository : JpaRepository<SchoolRegistrationEntity, UUID> {
    fun existsByPublicReference(publicReference: String): Boolean
}