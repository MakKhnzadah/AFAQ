package no.afaq.api

import no.afaq.api.dto.ClassroomResponse
import no.afaq.api.dto.CreateClassroomRequest
import no.afaq.api.dto.UpdateClassroomRequest
import no.afaq.persistence.entity.ClassroomEntity
import no.afaq.persistence.repository.ClassroomRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class ClassroomService(
    private val classroomRepository: ClassroomRepository,
) {
    @Transactional(readOnly = true)
    fun listActiveClassrooms(): List<ClassroomResponse> =
        classroomRepository.findAllByActiveTrueOrderByDisplayOrderAsc()
            .map(::toResponse)

    @Transactional(readOnly = true)
    fun listAllClassrooms(): List<ClassroomResponse> =
        classroomRepository.findAll().sortedBy { it.displayOrder }
            .map(::toResponse)

    @Transactional
    fun createClassroom(request: CreateClassroomRequest): ClassroomResponse {
        val entity = ClassroomEntity(
            name = request.name.trim(),
            description = request.description?.trim()?.takeIf { it.isNotEmpty() },
            capacity = request.capacity,
            active = request.active,
            displayOrder = request.displayOrder,
        )
        return toResponse(classroomRepository.save(entity))
    }

    @Transactional
    fun updateClassroom(id: UUID, request: UpdateClassroomRequest): ClassroomResponse {
        val entity = classroomRepository.findById(id).orElseThrow { IllegalArgumentException("Classroom not found") }
        entity.name = request.name.trim()
        entity.description = request.description?.trim()?.takeIf { it.isNotEmpty() }
        entity.capacity = request.capacity
        entity.active = request.active
        entity.displayOrder = request.displayOrder
        return toResponse(classroomRepository.save(entity))
    }

    @Transactional
    fun setActiveStatus(id: UUID, active: Boolean): ClassroomResponse {
        val entity = classroomRepository.findById(id).orElseThrow { IllegalArgumentException("Classroom not found") }
        entity.active = active
        return toResponse(classroomRepository.save(entity))
    }

    private fun toResponse(entity: ClassroomEntity): ClassroomResponse =
        ClassroomResponse(
            id = entity.id ?: throw IllegalStateException("Classroom id missing"),
            name = entity.name,
            description = entity.description,
            capacity = entity.capacity,
            active = entity.active,
            displayOrder = entity.displayOrder,
        )
}
