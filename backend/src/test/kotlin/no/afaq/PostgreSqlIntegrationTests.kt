package no.afaq

import jakarta.persistence.EntityManager
import no.afaq.persistence.entity.AdminUserEntity
import no.afaq.persistence.entity.ClassroomEntity
import no.afaq.persistence.entity.RoleEntity
import no.afaq.persistence.entity.SchoolRegistrationEntity
import no.afaq.persistence.entity.SchoolRegistrationStatus
import no.afaq.persistence.repository.AdminUserRepository
import no.afaq.persistence.repository.ClassroomRepository
import no.afaq.persistence.repository.RoleRepository
import no.afaq.persistence.repository.SchoolRegistrationRepository
import org.flywaydb.core.Flyway
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.time.LocalDate
import java.util.UUID

@SpringBootTest
@ActiveProfiles("integration-test")
@Testcontainers(disabledWithoutDocker = true)
@Tag("integration")
@Transactional
class PostgreSqlIntegrationTests {

    @Autowired
    private lateinit var flyway: Flyway

    @Autowired
    private lateinit var roleRepository: RoleRepository

    @Autowired
    private lateinit var adminUserRepository: AdminUserRepository

    @Autowired
    private lateinit var classroomRepository: ClassroomRepository

    @Autowired
    private lateinit var schoolRegistrationRepository: SchoolRegistrationRepository

    @Autowired
    private lateinit var entityManager: EntityManager

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    companion object {
        @Container
        @JvmStatic
        @ServiceConnection
        val postgresContainer: PostgreSQLContainer<*> = PostgreSQLContainer("postgres:16-alpine")
            .withDatabaseName("afaq_integration_test")
            .withUsername("afaq")
            .withPassword("afaq")
    }

    @Test
    fun flywayMigratesCleanDatabaseSuccessfully() {
        assertTrue(flyway.info().applied().isNotEmpty())
    }

    @Test
    fun seededRolesExist() {
        assertEquals(2, roleRepository.count())
        assertEquals(
            setOf("ROLE_ADMIN", "ROLE_SUPER_ADMIN"),
            roleRepository.findAll().map { it.name }.toSet(),
        )
    }

    @Test
    fun eightClassroomsExistWithSequentialDisplayOrder() {
        val classrooms = classroomRepository.findAllByActiveTrueOrderByDisplayOrderAsc()

        assertEquals(8, classrooms.size)
        assertEquals((1..8).toList(), classrooms.map { it.displayOrder })
    }

    @Test
    fun validSchoolRegistrationCanBePersisted() {
        val classroom = classroomRepository.findAllByActiveTrueOrderByDisplayOrderAsc().first()

        val registration = SchoolRegistrationEntity(
            publicReference = "SR-0001",
            childFullName = "Ahmed Ali",
            childDateOfBirth = LocalDate.of(2017, 5, 10),
            guardianFullName = "Sara Ali",
            phoneNumber = "+4712345678",
            email = "sara@example.com",
            address = "Storgata 1, Grimstad",
            classroom = classroom,
            comment = "Looking forward to the autumn term.",
            status = SchoolRegistrationStatus.PENDING,
            consentAccepted = true,
            privacyPolicyVersion = "2026-07",
        )

        val saved = schoolRegistrationRepository.saveAndFlush(registration)

        assertNotNull(saved.id)
        assertEquals("SR-0001", saved.publicReference)
        assertEquals(classroom.id, saved.classroom?.id)
    }

    @Test
    fun duplicatePublicRegistrationReferenceIsRejected() {
        val classroom = classroomRepository.findAllByActiveTrueOrderByDisplayOrderAsc().first()

        schoolRegistrationRepository.saveAndFlush(
            SchoolRegistrationEntity(
                publicReference = "SR-0002",
                childFullName = "Child One",
                childDateOfBirth = LocalDate.of(2018, 1, 1),
                guardianFullName = "Guardian One",
                phoneNumber = "+4711111111",
                email = "guardian.one@example.com",
                address = "Address 1",
                classroom = classroom,
                consentAccepted = true,
                privacyPolicyVersion = "2026-07",
            ),
        )

        assertThrows(DataIntegrityViolationException::class.java) {
            schoolRegistrationRepository.saveAndFlush(
                SchoolRegistrationEntity(
                    publicReference = "SR-0002",
                    childFullName = "Child Two",
                    childDateOfBirth = LocalDate.of(2018, 2, 2),
                    guardianFullName = "Guardian Two",
                    phoneNumber = "+4722222222",
                    email = "guardian.two@example.com",
                    address = "Address 2",
                    classroom = classroom,
                    consentAccepted = true,
                    privacyPolicyVersion = "2026-07",
                ),
            )
        }
    }

    @Test
    fun invalidRegistrationStatusIsRejected() {
        val classroom = classroomRepository.findAllByActiveTrueOrderByDisplayOrderAsc().first()

        assertThrows(DataIntegrityViolationException::class.java) {
            jdbcTemplate.update(
                """
                insert into school_registrations (
                    public_reference,
                    child_full_name,
                    child_date_of_birth,
                    guardian_full_name,
                    phone_number,
                    email,
                    address,
                    classroom_id,
                    status,
                    consent_accepted,
                    consent_timestamp,
                    privacy_policy_version,
                    created_at,
                    updated_at,
                    version
                ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp, ?, current_timestamp, current_timestamp, 0)
                """.trimIndent(),
                "SR-0003",
                "Child Three",
                LocalDate.of(2017, 3, 3),
                "Guardian Three",
                "+4733333333",
                "guardian.three@example.com",
                "Address 3",
                classroom.id,
                "INVALID",
                true,
                "2026-07",
            )
        }
    }

    @Test
    fun registrationCannotReferenceMissingClassroom() {
        assertThrows(DataIntegrityViolationException::class.java) {
            jdbcTemplate.update(
                """
                insert into school_registrations (
                    public_reference,
                    child_full_name,
                    child_date_of_birth,
                    guardian_full_name,
                    phone_number,
                    email,
                    address,
                    classroom_id,
                    status,
                    consent_accepted,
                    consent_timestamp,
                    privacy_policy_version,
                    created_at,
                    updated_at,
                    version
                ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp, ?, current_timestamp, current_timestamp, 0)
                """.trimIndent(),
                "SR-0004",
                "Child Four",
                LocalDate.of(2016, 4, 4),
                "Guardian Four",
                "+4744444444",
                "guardian.four@example.com",
                "Address 4",
                UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                "PENDING",
                true,
                "2026-07",
            )
        }
    }

    @Test
    fun classroomDeletionIsPreventedWhenReferenced() {
        val classroom = classroomRepository.findAllByActiveTrueOrderByDisplayOrderAsc().first()
        val classroomId = requireNotNull(classroom.id)

        schoolRegistrationRepository.saveAndFlush(
            SchoolRegistrationEntity(
                publicReference = "SR-0005",
                childFullName = "Child Five",
                childDateOfBirth = LocalDate.of(2017, 5, 5),
                guardianFullName = "Guardian Five",
                phoneNumber = "+4755555555",
                email = "guardian.five@example.com",
                address = "Address 5",
                classroom = classroom,
                consentAccepted = true,
                privacyPolicyVersion = "2026-07",
            ),
        )

        entityManager.clear()

        assertThrows(DataIntegrityViolationException::class.java) {
            classroomRepository.deleteById(classroomId)
            classroomRepository.flush()
        }
    }
}