package no.afaq.api

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.afaq.api.dto.CreateSchoolRegistrationRequest
import no.afaq.persistence.entity.ClassroomEntity
import no.afaq.persistence.entity.SchoolRegistrationEntity
import no.afaq.persistence.repository.ClassroomRepository
import no.afaq.persistence.repository.SchoolRegistrationRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.util.Optional
import java.util.UUID

class SchoolRegistrationServiceTest {

    private val classroomRepository = mockk<ClassroomRepository>()
    private val schoolRegistrationRepository = mockk<SchoolRegistrationRepository>()

    private val service = SchoolRegistrationService(classroomRepository, schoolRegistrationRepository)

    @Test
    fun `creates a registration and generates a public reference`() {
        val classroom = ClassroomEntity(
            id = UUID.randomUUID(),
            name = "Klasserom 1",
            active = true,
            displayOrder = 1,
        )

        every { classroomRepository.findById(any()) } returns Optional.of(classroom)
        every { schoolRegistrationRepository.existsByPublicReference(any()) } returns false
        every { schoolRegistrationRepository.save(any()) } answers { firstArg<SchoolRegistrationEntity>().also { it.id = UUID.randomUUID(); it.createdAt = java.time.Instant.now() } }

        val request = CreateSchoolRegistrationRequest(
            childFullName = "Anas Ahmed",
            childDateOfBirth = LocalDate.of(2017, 5, 10),
            guardianFullName = "Sara Ahmed",
            phoneNumber = "+4712345678",
            email = "sara@example.com",
            address = "Storgata 1",
            classroomId = classroom.id!!,
            comment = "Looking forward to the autumn term.",
            consentAccepted = true,
            privacyPolicyVersion = "2026-07",
        )

        val response = service.createRegistration(request)

        assertNotNull(response.publicReference)
        assertTrue(response.publicReference.startsWith("SR-"))
        assertEquals(9, response.ageYears)
        verify { schoolRegistrationRepository.save(any()) }
    }

    @Test
    fun `rejects a registration without consent`() {
        val classroom = ClassroomEntity(
            id = UUID.randomUUID(),
            name = "Klasserom 2",
            active = true,
            displayOrder = 2,
        )

        every { classroomRepository.findById(any()) } returns Optional.of(classroom)

        val request = CreateSchoolRegistrationRequest(
            childFullName = "Noor Ahmed",
            childDateOfBirth = LocalDate.of(2018, 2, 2),
            guardianFullName = "Ali Ahmed",
            phoneNumber = "+4798765432",
            email = "ali@example.com",
            address = "Vestregata 2",
            classroomId = classroom.id!!,
            consentAccepted = false,
            privacyPolicyVersion = "2026-07",
        )

        val exception = org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException::class.java) {
            service.createRegistration(request)
        }

        assertTrue(exception.message?.contains("Consent") == true)
    }
}
