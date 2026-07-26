package no.afaq.api

import jakarta.validation.Valid
import no.afaq.api.dto.CreateClassroomRequest
import no.afaq.api.dto.UpdateClassroomRequest
import no.afaq.api.dto.UpdateClassroomStatusRequest
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api")
class ClassroomController(
    private val classroomService: ClassroomService,
) {
    @GetMapping("/public/classrooms")
    fun listPublicClassrooms() = classroomService.listActiveClassrooms()

    @GetMapping("/admin/classrooms")
    fun listAdminClassrooms() = classroomService.listAllClassrooms()

    @PostMapping("/admin/classrooms")
    fun createClassroom(@Valid @RequestBody request: CreateClassroomRequest) = classroomService.createClassroom(request)

    @PutMapping("/admin/classrooms/{id}")
    fun updateClassroom(@PathVariable id: UUID, @Valid @RequestBody request: UpdateClassroomRequest) =
        classroomService.updateClassroom(id, request)

    @PatchMapping("/admin/classrooms/{id}/status")
    fun updateStatus(@PathVariable id: UUID, @RequestBody request: UpdateClassroomStatusRequest) =
        classroomService.setActiveStatus(id, request.active)
}
