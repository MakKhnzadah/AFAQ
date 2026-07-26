package no.afaq.api

import no.afaq.api.dto.CreateSchoolRegistrationRequest
import no.afaq.api.dto.SchoolRegistrationResponse
import no.afaq.persistence.entity.SchoolRegistrationEntity
import no.afaq.persistence.entity.SchoolRegistrationStatus
import no.afaq.persistence.repository.ClassroomRepository
import no.afaq.persistence.repository.SchoolRegistrationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@Service
class SchoolRegistrationService(
    private val classroomRepository: ClassroomRepository,
    private val schoolRegistrationRepository: SchoolRegistrationRepository,
) {
    @Transactional
    fun createRegistration(request: CreateSchoolRegistrationRequest): SchoolRegistrationResponse {
        require(request.consentAccepted) { "Consent must be accepted" }

        val classroom = classroomRepository.findById(request.classroomId)
            .orElseThrow { IllegalArgumentException("Classroom not found") }
        require(classroom.active) { "Selected classroom is not active" }

        val publicReference = generatePublicReference()
        val entity = SchoolRegistrationEntity(
            publicReference = publicReference,
            childFullName = request.childFullName.trim(),
            childDateOfBirth = request.childDateOfBirth,
            guardianFullName = request.guardianFullName.trim(),
            phoneNumber = request.phoneNumber.trim(),
            email = request.email.trim().lowercase(),
            address = request.address.trim(),
            classroom = classroom,
            comment = request.comment?.trim()?.takeIf { it.isNotEmpty() },
            status = SchoolRegistrationStatus.PENDING,
            consentAccepted = true,
            consentTimestamp = Instant.now(),
            privacyPolicyVersion = request.privacyPolicyVersion.trim(),
        )

        val saved = schoolRegistrationRepository.save(entity)
        return SchoolRegistrationResponse(
            publicReference = saved.publicReference,
            ageYears = calculateAgeYears(saved.childDateOfBirth),
            createdAt = saved.createdAt,
        )
    }

    private fun generatePublicReference(): String {
        val stamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
        val suffix = java.util.UUID.randomUUID().toString().take(6).uppercase()
        var candidate = "SR-$stamp-$suffix"
        var counter = 1
        while (schoolRegistrationRepository.existsByPublicReference(candidate)) {
            candidate = "SR-$stamp-$suffix-$counter"
            counter += 1
        }
        return candidate
    }

    private fun calculateAgeYears(dateOfBirth: LocalDate?): Int? =
        dateOfBirth?.let { ChronoUnit.YEARS.between(it, LocalDate.now()).toInt() }
}
