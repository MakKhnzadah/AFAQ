FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /workspace

COPY gradlew gradlew
COPY gradle gradle
COPY settings.gradle.kts build.gradle.kts ./
RUN chmod +x gradlew \
    && ./gradlew --no-daemon dependencies

COPY src src
RUN ./gradlew --no-daemon bootJar

FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S afaq \
    && adduser -S -G afaq afaq

WORKDIR /app

COPY --from=build --chown=afaq:afaq /workspace/build/libs/app.jar app.jar

USER afaq

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
