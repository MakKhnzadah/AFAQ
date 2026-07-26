# Continuous integration

The `CI` GitHub Actions workflow runs for pull requests and pushes to `main`.
It does not publish artifacts, push container images, or deploy the application.

## Checks

- **Frontend build:** installs the locked npm dependency tree with `npm ci` and
  runs the Vite production build.
- **Backend unit tests:** runs the non-integration JUnit suite with Java 21.
- **PostgreSQL integration tests:** verifies Docker is available and runs the
  integration-tagged tests. Testcontainers starts a real
  `postgres:16-alpine` container. CI also inspects the JUnit XML report and
  fails if the PostgreSQL test class is missing, has fewer than eight tests, or
  reports any skipped tests.
- **Backend Docker build:** builds the Java 21 backend image with Buildx without
  pushing it to a registry.

The frontend uses npm dependency caching, backend jobs use the Gradle Actions
cache, and the Docker build uses GitHub Actions cache storage.

## Run the same checks locally

Requirements:

- Node.js 20 or later
- Java 21
- Docker with a running daemon

From the repository root:

```bash
npm ci
npm run build

cd backend
./gradlew --no-daemon test
docker info
docker pull postgres:16-alpine
./gradlew --no-daemon integrationTest
cd ..

docker build --tag afaq-backend:ci backend
```

`PostgreSqlIntegrationTests` uses
`@Testcontainers(disabledWithoutDocker = true)`. Without a working Docker
environment, JUnit skips that class. The CI job runs `docker info` first and
verifies the generated test report afterward so an unavailable container
runtime cannot appear as a successful integration-test run.
