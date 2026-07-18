package no.afaq

import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class AfaqBackendApplicationTests {

    @Autowired
    private lateinit var applicationContext: org.springframework.context.ApplicationContext

    @Test
    fun contextLoads() {
        assertNotNull(applicationContext)
    }
}
