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
import org.junit.jupiter.api.Assertions.assertThrows
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
        every {
            schoolRegistrationRepository.existsByEmailIgnoreCaseAndChildFullNameIgnoreCaseAndChildDateOfBirth(
                any(),
                any(),
                any(),
            )
        } returns false
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

    @Test
    fun `rejects a future date of birth`() {
        val request = validRequest(childDateOfBirth = LocalDate.now().plusDays(1))

        val exception = assertThrows(IllegalArgumentException::class.java) {
            service.createRegistration(request)
        }

        assertTrue(exception.message?.contains("future") == true)
        verify(exactly = 0) { schoolRegistrationRepository.save(any()) }
    }

    @Test
    fun `rejects a duplicate registration for the same child`() {
        val classroom = ClassroomEntity(
            id = UUID.randomUUID(),
            name = "Klasserom 3",
            active = true,
            displayOrder = 3,
        )
        val request = validRequest(classroomId = classroom.id!!)

        every { classroomRepository.findById(classroom.id!!) } returns Optional.of(classroom)
        every {
            schoolRegistrationRepository.existsByEmailIgnoreCaseAndChildFullNameIgnoreCaseAndChildDateOfBirth(
                request.email,
                request.childFullName,
                request.childDateOfBirth,
            )
        } returns true

        assertThrows(DuplicateRegistrationException::class.java) {
            service.createRegistration(request)
        }
        verify(exactly = 0) { schoolRegistrationRepository.save(any()) }
    }

    private fun validRequest(
        childDateOfBirth: LocalDate = LocalDate.of(2018, 2, 2),
        classroomId: UUID = UUID.randomUUID(),
    ) = CreateSchoolRegistrationRequest(
        childFullName = "Noor Ahmed",
        childDateOfBirth = childDateOfBirth,
        guardianFullName = "Ali Ahmed",
        phoneNumber = "+4798765432",
        email = "ali@example.com",
        address = "Vestregata 2",
        classroomId = classroomId,
        consentAccepted = true,
        privacyPolicyVersion = "2026-07",
    )
}
