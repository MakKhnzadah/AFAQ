package no.afaq

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class AfaqBackendApplication

fun main(args: Array<String>) {
    runApplication<AfaqBackendApplication>(*args)
}
