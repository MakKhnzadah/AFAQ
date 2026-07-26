
  # Afaq Islamic Center Website

  This is a code bundle for Afaq Islamic Center Website. The original project is available at https://www.figma.com/design/MSUDpmgp4juLBb5YR9OSA5/Afaq-Islamic-Center-Website.

## Running the code

Run `npm i` to install the frontend dependencies.

Run `npm run dev` to start the frontend development server.

The backend requires Java 21. If your system defaults to another JDK, set:

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
```

Fast backend context tests:

```bash
cd backend && ./gradlew test
```

PostgreSQL integration tests:

```bash
cd backend && ./gradlew integrationTest
```

Docker is required for the PostgreSQL integration tests.

The checked-in backend Gradle wrapper includes `backend/gradlew`, `backend/gradlew.bat`, `backend/gradle/wrapper/gradle-wrapper.properties`, and `backend/gradle/wrapper/gradle-wrapper.jar`.

## Continuous integration

Pull requests and pushes to `main` run frontend build, backend unit-test,
PostgreSQL integration-test, and backend Docker-build checks. See
[docs/ci.md](docs/ci.md) for details and equivalent local commands.


Prompt — Connect the Existing AFAQ Frontend to Kotlin and PostgreSQL

You are a senior full-stack software engineer and solution architect specializing in:

React
TypeScript
Kotlin
Spring Boot
PostgreSQL
Spring Security
REST APIs
Docker
Testing
Application security

I am building a website for AFAQ Islamsk Kultursenter in Grimstad, Norway.

A large part of the frontend has already been created and updated using Figma AI, React, and TypeScript.

Your task is not to redesign or rebuild the application from scratch.

First inspect the existing repository, understand the actual implementation, preserve the current design, and connect the existing frontend to a real backend built with Kotlin, Spring Boot, and PostgreSQL.

1. Current technology stack

The frontend currently uses:

React
TypeScript

The required backend stack is:

Kotlin
Spring Boot
Spring Web
Spring Data JPA
Spring Security
Jakarta Bean Validation
PostgreSQL
Flyway
Gradle Kotlin DSL
OpenAPI / Swagger
JUnit 5
MockK
Testcontainers
Docker
Docker Compose

The frontend and backend must communicate through a typed REST API using JSON.

The frontend must never connect directly to PostgreSQL.

2. Important implementation rule

Before changing any code:

Inspect the repository structure.
Read the existing React pages and components.
Identify how state is currently stored.
Identify whether data is hardcoded, stored in local state, or stored in localStorage.
Identify current routes.
Identify existing styling and reusable components.
Identify how the admin panel is currently accessed.
Identify all temporary frontend-only implementations.
Produce a concise implementation plan based on the actual files.

Do not invent files that do not exist.

Do not replace working UI components unless necessary.

Do not change the existing visual identity, colors, typography, spacing, card style, responsive behavior, or bilingual functionality unless required to fix a problem.

3. Current frontend implementation created by Figma AI

The following functionality has already been implemented in the frontend.

3.1 “Tjenester” was replaced with “Arabisk skole”

A new file or page named similar to:

ArabicSchoolPage.tsx

has been created.

The page contains four tabs:

Registrering
Skoletid
Aktiviteter
Annonser

Preserve this tab-based design unless the current code shows that another structure is more appropriate.

3.2 Registration tab

The registration tab currently contains a complete registration form with:

Child information
Parent or guardian information
Classroom selection from 1 to 8
Consent checkbox
Validation messages
Language-aware labels and error messages
Confirmation screen after submission

The current implementation sends the registration to:

qosaya@gmail.com

using a mailto: link.

This is only a temporary frontend solution.

Replace the mailto: submission with a real backend API and PostgreSQL persistence.

The new flow must be:

React registration form
        |
        | POST /api/public/school-registrations
        v
Kotlin Spring Boot backend
        |
        v
PostgreSQL

After successful submission:

Store the registration in PostgreSQL.
Return a unique public registration reference.
Show the existing success confirmation screen.
Prevent duplicate submissions.
Disable the submit button while the request is in progress.
Show a clear server error if submission fails.
Do not expose the internal database ID.
Optionally send an email notification to the administration from the backend later, but database storage is the primary requirement.

Do not use mailto: for registration after the backend integration is completed.

3.3 School schedule tab

The school schedule tab is currently prefilled with:

Sunday, 12:00–15:00, including breaks

The frontend indicates that this content can be edited from the admin panel.

Replace hardcoded or local-only schedule data with data loaded from PostgreSQL.

Public users should receive active schedule entries from:

GET /api/public/school-schedules

Administrators must manage schedules through protected endpoints.

The existing visual presentation must be preserved.

3.4 Activities tab

The activities tab is currently empty until an administrator creates content.

The existing UI supports or expects:

Title in Norwegian
Title in Arabic
Description
Date
Time
Image
Contact information

Connect this tab to backend-managed activity data.

Public users must only see published activities.

Administrators must be able to:

Create an activity
Edit an activity
Delete an activity
Upload an image
Replace an image
Remove an image
Publish or unpublish an activity
3.5 Announcements tab

The announcements tab currently contains a prefilled welcome announcement.

It supports or expects:

Title
Short description
Full text
Featured status
Publication date
Expiration date
Optional image or attachment

Move announcements from hardcoded frontend data to PostgreSQL.

Public users must only see announcements that:

Are published
Have reached their publication date
Have not passed their expiration date

Featured announcements must appear first.

4. Current homepage implementation

The old homepage card containing information similar to:

Grimstad, Norge
Kontakt

has already been replaced with an “Arabisk skole” card.

The current card includes two buttons:

Les mer
Registrer barn

Both buttons lead to the Arabic school page.

Preserve this implementation.

Verify that:

“Les mer” opens the Arabic school page.
“Registrer barn” opens or scrolls to the registration section.
Navigation works on desktop and mobile.
The route does not break after backend integration.

Suggested routes:

/arabisk-skole
/arabisk-skole#registrering

5. Current donation implementation

The homepage currently contains a green donation banner or card with a:

Doner nå

button.

The button opens a modal containing:

One-time donation option
Monthly donation option
Preset amounts:
100 NOK
200 NOK
500 NOK
1000 NOK
Custom amount field
Vipps information
Bank-transfer information

Preserve the current design and modal behavior.

However, review whether the current donation flow only displays static information.

Implement donation architecture safely.

The system must not collect or store card details directly.

Use a payment abstraction such as:

interface PaymentService {
    fun createDonationSession(
        request: DonationRequest
    ): DonationSessionResponse

    fun handleWebhook(
        payload: String,
        signature: String
    )
}

The initial implementation may support:

Static Vipps payment instructions
Static bank-transfer instructions
Recording an optional donation intent

A later payment-provider integration may support:

Vipps MobilePay
Stripe

Do not invent active production payment credentials.

If no payment provider has been selected, create a clean service abstraction and mark provider-specific work as a documented TODO.

Donation frequency values:

ONE_TIME
MONTHLY

Donation status values:

CREATED
PENDING
PAID
FAILED
CANCELLED
REFUNDED

Never mark a donation as paid only because the frontend redirected to a success page.

Confirmed online payments must be verified through a signed provider webhook.

Use NOK as the default currency.

6. Current events implementation

The events page has already been rewritten.

It currently includes category filters:

Alle
Religiøs
Kulturell

The category filters use visually distinct pills or badges.

It also includes status filters:

Kommende
Gjennomført
Alle

The page currently contains prefilled events tagged as religious or cultural.

Preserve the existing event cards, filters, colors, and responsive layout.

Move event data from hardcoded frontend arrays or local storage to PostgreSQL.

Backend event categories:

RELIGIOUS
CULTURAL

Frontend Norwegian labels:

Religiøs
Kulturell

Event publication statuses:

DRAFT
PUBLISHED
CANCELLED
COMPLETED

Administrators must be able to:

Create events
Edit events
Delete events
Select a category
Upload an image
Set the event date
Set start and end times
Set the location
Publish or unpublish the event
Cancel the event

Prefer calculating whether an event is upcoming or completed from its date and end time.

Do not rely only on a manually stored “upcoming/completed” value if the status can be calculated reliably.

Public endpoints should support filtering:

GET /api/public/events
GET /api/public/events?category=RELIGIOUS
GET /api/public/events?category=CULTURAL
GET /api/public/events?upcoming=true
GET /api/public/events?completed=true

7. Current admin panel implementation

The current admin panel contains three main tabs:

Galleri
Arabisk skole
Arrangementer
7.1 Gallery tab

The gallery tab currently supports managing gallery images.

The administrator should ultimately be able to:

Upload an image
Edit image metadata
Delete an image
Reorder images
Add alternative text
Add an optional caption
Publish or unpublish an image

Move gallery data and metadata to PostgreSQL.

Do not store large image binaries directly in PostgreSQL.

Store:

Image URL or storage key
Filename generated by the server
MIME type
Size
Alternative text
Caption
Display order
Publication status
Creation time
Update time

Create a storage abstraction that supports local development storage and can later support an S3-compatible provider.

7.2 Arabic school admin tab

The current Arabic school administration UI allows management of:

School schedules
Activities
Announcements

Preserve the existing admin forms and layout.

Replace local state, hardcoded arrays, or localStorage persistence with protected backend APIs.

Also add registration management to the Arabic school admin area.

Administrators must be able to:

View registrations
Search registrations
Filter by classroom
Filter by status
Filter by registration date
View registration details
Change registration status
Assign or change classroom
Add an internal admin note
Delete or anonymize a registration when appropriate

Registration status values:

PENDING
APPROVED
REJECTED
WAITLISTED

Sensitive registration data must only be available to authenticated administrators.

7.3 Events admin tab

The current events admin UI supports:

Creating events
Editing events
Deleting events
Selecting a category
Uploading an image
Setting the location
Selecting upcoming or completed status
Managing announcements separately

Preserve the current UI.

Connect every admin operation to protected Kotlin endpoints.

Do not rely on frontend-only access control.

8. Critical security issue in the current admin access

The current admin access model is disabled in this frontend-only snapshot until secure backend authentication is implemented.

The admin area is accessed through an invisible dot in the lower-left corner.

This is an insecure temporary implementation.

Remove this security model completely.

Do not keep:

A hardcoded password
A password inside React code
A password inside environment variables exposed to the frontend
An invisible secret access button
Client-side-only authentication
Authentication stored as a simple Boolean in localStorage

Replace it with a proper admin login page and secure backend authentication.

Suggested admin login route:

/admin/login

Suggested protected admin route:

/admin

Use Spring Security.

Preferred browser authentication approach:

Secure server-side session
HttpOnly cookie
Secure cookie in production
SameSite configuration
CSRF protection
Restricted CORS

Passwords must be hashed using:

Argon2, preferably
or BCrypt

Never store plain-text passwords.

Suggested roles:

ROLE_ADMIN
ROLE_SUPER_ADMIN

Suggested permissions:

ROLE_ADMIN: manage registrations, schedules, activities, announcements, events, and gallery content
ROLE_SUPER_ADMIN: all admin permissions plus admin-user management and critical settings

The frontend may hide unauthorized controls for user experience, but every protected backend endpoint must enforce authorization independently.

9. Required backend architecture

Use a clean layered structure similar to:

backend/
├── src/main/kotlin/com/afaq/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── mapper/
│   ├── security/
│   ├── exception/
│   ├── validation/
│   ├── configuration/
│   ├── storage/
│   └── payment/
│
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
│
└── build.gradle.kts

Responsibilities:

Controller: HTTP requests and responses
Service: business logic
Repository: database access
Entity: JPA persistence model
DTO: API request and response model
Mapper: entity and DTO conversion
Security: authentication and authorization
Storage: image and attachment management
Payment: donation-provider abstraction
Exception: consistent error responses

Do not expose JPA entities directly from controllers.

Use DTOs for all API input and output.

Use constructor injection.

Keep controllers thin.

Place business logic in services.

Use transactions where appropriate.

10. PostgreSQL database design

Create normalized PostgreSQL tables for:

admin_users
roles
admin_user_roles
classrooms
school_registrations
school_schedules
school_activities
activity_images
announcements
announcement_attachments
events
event_images
gallery_images
donations
payment_webhook_events
media_files
audit_logs

Suggested relationships:

classrooms
    1 ─── many school_registrations

classrooms
    1 ─── many school_schedules

school_activities
    1 ─── many activity_images

events
    1 ─── many event_images

admin_users
    many ─── many roles

media_files
    1 ─── many entity references where appropriate

Add:

Primary keys
Foreign keys
Unique constraints
Check constraints
Useful indexes
Created timestamps
Updated timestamps
Optional optimistic-locking version fields

Use UUIDs for public-facing entities when appropriate.

Create indexes for:

Registration status
Registration classroom
Registration creation date
Event date
Event category
Event publication status
Announcement publication date
Announcement expiration date
Activity publication status
Donation status
Payment-provider reference
Admin email
Gallery display order

Use Flyway for all schema changes.

Use:

spring.jpa.hibernate.ddl-auto=validate

Do not use destructive automatic schema generation in production.

11. Required Flyway seed data

Seed the following classroom records:

Klasserom 1
Klasserom 2
Klasserom 3
Klasserom 4
Klasserom 5
Klasserom 6
Klasserom 7
Klasserom 8

Seed roles:

ROLE_ADMIN
ROLE_SUPER_ADMIN

Do not seed a plain-text password.

Create the first administrator through one of these secure approaches:

A one-time bootstrap command
Secure backend environment variables
A dedicated initialization process
A one-use administrator creation endpoint disabled after setup

Document the selected method.

12. Suggested REST API
Authentication
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
Public classrooms
GET /api/public/classrooms
Public school registration
POST /api/public/school-registrations
Admin registration management
GET    /api/admin/school-registrations
GET    /api/admin/school-registrations/{id}
PATCH  /api/admin/school-registrations/{id}/status
PATCH  /api/admin/school-registrations/{id}/classroom
PATCH  /api/admin/school-registrations/{id}/note
DELETE /api/admin/school-registrations/{id}
Public school schedules
GET /api/public/school-schedules
Admin school schedules
GET    /api/admin/school-schedules
POST   /api/admin/school-schedules
PUT    /api/admin/school-schedules/{id}
DELETE /api/admin/school-schedules/{id}
Public school activities
GET /api/public/school-activities
GET /api/public/school-activities/{id}
Admin school activities
GET    /api/admin/school-activities
POST   /api/admin/school-activities
PUT    /api/admin/school-activities/{id}
DELETE /api/admin/school-activities/{id}
POST   /api/admin/school-activities/{id}/images
DELETE /api/admin/school-activities/{id}/images/{imageId}
Public announcements
GET /api/public/school-announcements
GET /api/public/school-announcements/{id}
Admin announcements
GET    /api/admin/announcements
POST   /api/admin/announcements
PUT    /api/admin/announcements/{id}
DELETE /api/admin/announcements/{id}
POST   /api/admin/announcements/{id}/attachments
DELETE /api/admin/announcements/{id}/attachments/{attachmentId}
Public events
GET /api/public/events
GET /api/public/events/{id}
Admin events
GET    /api/admin/events
POST   /api/admin/events
PUT    /api/admin/events/{id}
DELETE /api/admin/events/{id}
POST   /api/admin/events/{id}/images
DELETE /api/admin/events/{id}/images/{imageId}
Public gallery
GET /api/public/gallery
Admin gallery
GET    /api/admin/gallery
POST   /api/admin/gallery
PUT    /api/admin/gallery/{id}
DELETE /api/admin/gallery/{id}
PATCH  /api/admin/gallery/reorder
Donations
POST /api/public/donations/session
POST /api/webhooks/payments
GET  /api/admin/donations
GET  /api/admin/donations/{id}

Use pagination for admin list endpoints.

Suggested response format:

{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0
}
13. Registration request model

Create a registration request similar to:

{
  "childFullName": "Example Name",
  "childAge": 8,
  "childDateOfBirth": "2018-04-21",
  "guardianFullName": "Parent Name",
  "phoneNumber": "+47...",
  "email": "parent@example.com",
  "address": "Example address",
  "classroomId": "uuid",
  "comment": "Optional information",
  "consentAccepted": true,
  "privacyPolicyVersion": "1.0"
}

Validate:

Child name is required
Guardian name is required
Email is valid
Telephone number has a reasonable format
Classroom exists and is active
Date of birth is not in the future
Age is consistent with the date of birth, or calculate age on the backend
Consent must be true
Comment has a maximum length
Address has a maximum length

Prefer calculating age from the date of birth instead of storing both age and date of birth unless there is a clear reason to keep both.

Store:

Consent value
Consent timestamp
Privacy-policy version

The consent checkbox must never be preselected.

14. Frontend API integration

Create a typed frontend API layer.

Suggested structure:

src/api/
├── apiClient.ts
├── authApi.ts
├── registrationApi.ts
├── classroomApi.ts
├── scheduleApi.ts
├── activityApi.ts
├── announcementApi.ts
├── eventApi.ts
├── galleryApi.ts
└── donationApi.ts

Create TypeScript request and response types.

Do not use any.

Use the existing frontend state-management approach if it is suitable.

Do not introduce a large new state-management library unless necessary.

Replace:

Hardcoded arrays
mailto: form submission
Frontend-only CRUD
localStorage content persistence
Hardcoded admin password
Fake authentication
Static admin data

with typed API calls.

Every screen must handle:

Loading
Empty state
Validation error
Server error
Unauthorized response
Success confirmation

15. File uploads

The current admin UI supports image uploads.

Implement secure backend file handling.

Validate:

Allowed MIME types
File extensions
Maximum file size
Image dimensions when appropriate

Do not trust the original filename.

Generate safe random filenames.

Prevent:

Directory traversal
Executable uploads
Script uploads
MIME-type spoofing where practical
Unauthorized upload access

Do not store large image files inside PostgreSQL.

Store metadata in PostgreSQL and the file in:

A local upload directory for development
An S3-compatible storage provider for production later

Create a storage interface such as:

interface StorageService {
    fun store(file: MultipartFile): StoredFile
    fun delete(storageKey: String)
    fun getPublicUrl(storageKey: String): String
}

16. Error handling

Use a global exception handler with:

@RestControllerAdvice

Return consistent error responses.

Example:

{
  "timestamp": "2026-07-18T12:00:00Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "One or more fields are invalid.",
  "fieldErrors": {
    "email": "E-postadressen er ugyldig.",
    "childFullName": "Barnets navn er obligatorisk."
  }
}

Do not expose:

Stack traces
SQL messages
Password hashes
Secret values
Internal security details
Full payment webhook payloads

Preserve the frontend’s current bilingual error-message behavior where practical.

17. Accessibility and responsive design

Preserve and improve the existing responsive design.

The application must work on:

Mobile
Tablet
Desktop

Verify:

Semantic HTML
Keyboard navigation
Visible focus states
Correct form labels
Accessible error messages
Proper heading order
Sufficient color contrast
Alternative text for meaningful images
Focus trapping in modals
Escape-key behavior in modals
Screen-reader announcements for submission success and errors

Do not replace working Figma-generated accessibility behavior without a reason.

18. Logging and auditing

Add structured backend logging.

Log:

Authentication success and failure without sensitive details
Admin content changes
Registration status changes
Image upload failures
Payment webhook processing
Unexpected backend errors

Create audit-log entries for important admin actions.

Suggested audit fields:

Admin user ID
Action
Entity type
Entity ID
Timestamp
Safe summary

Do not store personal registration fields in audit logs.

Do not log:

Full address
Personal comments
Passwords
Password hashes
Session identifiers
Payment secrets
Full phone numbers
Full email addresses unless strictly required and safely masked

19. Privacy and GDPR

The website operates in Norway and stores personal information.

Implement:

Data minimization
Explicit consent
Privacy-policy version tracking
Restricted administrator access
Configurable retention period
Ability to delete or anonymize registrations
Secure database backups
No sensitive data in logs
Clear documentation of why personal information is collected

Mark legal text for review by a qualified person.

Do not claim that the implementation automatically guarantees GDPR compliance.

20. Testing requirements
Backend tests

Use:

JUnit 5
MockK
Spring Boot Test
Testcontainers
PostgreSQL Testcontainer

Test:

Registration validation
Consent validation
Classroom validation
Duplicate registration handling
Registration status changes
Schedule time validation
Announcement publication logic
Announcement expiration logic
Activity publication filtering
Event-category filtering
Upcoming and completed event calculation
Authentication
Authorization
File validation
Admin access restrictions
Donation-session validation
Duplicate webhook handling

Do not rely only on an in-memory database when production uses PostgreSQL.

Frontend tests

Use the project’s current testing tools.

If none exist, use:

Vitest
React Testing Library

Test:

Registration form validation
Successful registration
Failed registration
Loading state
Duplicate-submit prevention
Arabic school tab navigation
Event filters
Donation modal
Admin login
Protected admin routes
Empty states
Server errors
End-to-end tests

Use Playwright if the repository does not already contain an end-to-end framework.

Test critical flows:

Administrator login
Public school registration
Administrator registration approval
Creating a school activity
Creating an announcement
Creating an event
Filtering events
Uploading a gallery image
Opening the donation modal

21. Docker development environment

Create or update:

docker-compose.yml
.env.example

Recommended services:

postgres
backend
frontend

The frontend service is optional for local development if the project already uses another workflow.

Use health checks.

Suggested environment variables:

POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
APP_FRONTEND_URL
APP_ALLOWED_ORIGINS
SESSION_SECRET
INITIAL_ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD
UPLOAD_DIRECTORY
PAYMENT_PROVIDER
PAYMENT_API_KEY
PAYMENT_WEBHOOK_SECRET

Do not commit the real .env file.

Do not expose backend secrets through frontend variables such as VITE_*.

22. Step-by-step implementation plan from A to Z

Follow this order.

A — Analyze the existing repository
Inspect the frontend structure
Find ArabicSchoolPage.tsx
Find HomePage.tsx
Find EventsPage.tsx
Find the current admin page
Find the gallery implementation
Find the donation modal
Find the registration submission code
Find the hardcoded password
Find the invisible admin-access dot
Find hardcoded data
Find localStorage usage
Find existing tests
Find current styling
Find the language or translation implementation

Create:

docs/current-state-analysis.md

The document must identify:

What already works
What is frontend-only
What must be preserved
What must be replaced
Security risks
Required backend endpoints
Expected file changes

Do not begin broad code changes before completing this analysis.

B — Remove insecure assumptions from the plan

Document the required replacement of:

mailto: registration
Hardcoded password removed from the frontend admin page
Invisible admin-access dot removed from the app shell
Client-side-only authentication
Hardcoded content arrays
Local-only CRUD
localStorage as the primary database
Fake payment completion

Do not remove working UI until the replacement backend flow is ready.

C — Bootstrap the Kotlin backend

Create a Spring Boot Kotlin backend with:

Gradle Kotlin DSL
Spring Web
Spring Data JPA
PostgreSQL driver
Spring Security
Validation
Flyway
OpenAPI
Testcontainers
MockK

Create:

backend/build.gradle.kts
backend/src/main/kotlin/...
backend/src/main/resources/application.yml
D — Configure PostgreSQL and Docker
Add PostgreSQL service
Configure database environment variables
Configure backend connection
Add health checks
Add .env.example
Verify the backend can connect
E — Design the database schema

Create:

docs/database-design.md

Document:

Tables
Relationships
Enums
Constraints
Indexes
Delete behavior
Personal-data fields
Retention considerations
F — Create Flyway migrations

Create migrations for:

Roles
Admin users
Classrooms
Registrations
Schedules
Activities
Announcements
Events
Gallery
Media
Donations
Audit logs

Seed:

Eight classrooms
Admin roles

Do not seed a real password.

G — Implement common backend foundations

Create:

Timestamp base entity
DTO conventions
Mapper conventions
Pagination response
Global exception handling
Validation error format
Logging conventions
API security conventions
H — Implement secure admin authentication
Add admin-user entity
Add role entity
Add password hashing
Add login endpoint
Add logout endpoint
Add current-user endpoint
Add session or token security
Add rate limiting
Add CSRF protection where required
Add restricted CORS
Add authentication tests

Only after this is working:

Remove the hardcoded frontend password
Remove the invisible access dot
Add /admin/login
Protect /admin
I — Implement classrooms
Add classroom entity
Add repository
Add service
Add public endpoint
Add admin endpoints
Add validation
Add tests
J — Implement school registration
Add registration entity
Add DTOs
Add public POST endpoint
Add consent tracking
Add reference generation
Add duplicate protection
Add admin list and detail endpoints
Add filtering
Add status updates
Add classroom assignment
Add admin notes
Add tests

Then replace the existing mailto: submission with the API call.

Preserve the current frontend success screen and validation style.

K — Implement school schedules
Add schedule entity
Add public endpoint
Add admin CRUD endpoints
Add ordering
Add active status
Add time validation
Add tests

Replace prefilled frontend-only schedule data with API data.

L — Implement school activities
Add activity entity
Add bilingual title fields if required by the existing frontend
Add description fields
Add publication status
Add image relation
Add public endpoint
Add admin CRUD
Add image upload
Add tests

Connect the existing activities tab and admin form.

M — Implement announcements
Add announcement entity
Add featured status
Add publication date
Add expiration date
Add image and attachment support
Add public filtering
Add admin CRUD
Add tests

Replace the prefilled welcome announcement with database content.

The initial welcome announcement may be seeded if appropriate.

N — Implement events
Add event entity
Add RELIGIOUS and CULTURAL
Add publication status
Add date and time fields
Add location
Add image support
Add public filters
Add admin CRUD
Add tests

Connect the existing event filters and cards to the API.

Preserve the current pill design and category colors.

O — Implement gallery management
Add gallery-image entity
Add media storage
Add public gallery endpoint
Add admin CRUD
Add reordering
Add alt text
Add captions
Add publication status
Add tests

Connect the existing gallery admin tab.

P — Implement storage service
Add storage interface
Add local development implementation
Add secure filenames
Add file validation
Add delete handling
Add public URL generation
Add tests

Do not store image binaries in PostgreSQL.

Q — Implement donation backend structure
Add donation entity
Add donation frequency
Add donation status
Add payment-service abstraction
Add donation-session endpoint
Add amount validation
Add optional provider integration
Add webhook endpoint structure
Add idempotency support
Add tests

Preserve the current donation modal.

Do not claim that a payment succeeded without backend verification.

R — Create API documentation

Configure OpenAPI and Swagger.

Document:

Public endpoints
Admin endpoints
Authentication
Request DTOs
Response DTOs
Errors
File uploads
Pagination
S — Create the typed frontend API client

Create or update:

src/api/

Add:

Base API client
Credential handling
Typed errors
Auth API
Registration API
Schedule API
Activity API
Announcement API
Event API
Gallery API
Donation API
T — Connect the Arabic school page

Keep the current four tabs.

Connect:

Registration to backend
Schedule to backend
Activities to backend
Announcements to backend

Add:

Loading states
Empty states
Retry behavior
Server errors
Unauthorized handling where relevant
U — Preserve and verify homepage changes

Verify:

Arabic school card remains
“Les mer” works
“Registrer barn” works
Donation banner remains
Donation modal remains
Responsive layout remains stable

Do not reintroduce the removed location card unless requested.

V — Connect the events page

Replace hardcoded event arrays with API data.

Preserve:

Category pills
Status filters
Card design
Responsive behavior
Norwegian labels
W — Connect and secure the admin panel

Preserve the three main admin tabs:

Galleri
Arabisk skole
Arrangementer

Connect every create, edit, and delete action to the backend.

Add registration management to the Arabic school tab or as a clearly related subtab.

Add:

Login page
Session-expired handling
Protected routes
Loading state
Error state
Empty state
Confirmation dialogs
Success notifications
Pagination
Search and filtering
X — Complete automated tests
Run backend unit tests
Run PostgreSQL integration tests
Run frontend tests
Run end-to-end tests
Add regression tests for discovered bugs
Fix all critical failures
Y — Prepare production configuration
Use production database variables
Restrict CORS
Enable secure cookies
Enable HTTPS
Configure trusted file storage
Configure backups
Configure monitoring
Configure payment webhook secrets if a provider is used
Run dependency vulnerability checks
Remove development credentials
Disable debug behavior
Z — Final review and documentation

Verify:

No mailto: registration remains
No hardcoded admin password remains
No invisible admin-access dot remains
No frontend-only authentication remains
No sensitive backend secrets are exposed to React
Registrations are stored in PostgreSQL
Schedules are stored in PostgreSQL
Activities are stored in PostgreSQL
Announcements are stored in PostgreSQL
Events are stored in PostgreSQL
Gallery metadata is stored in PostgreSQL
Admin endpoints are protected
Public endpoints return only published data
Mobile views still work
Bilingual content still works
Loading, success, empty, and error states work
Flyway works on a clean database
Docker services start successfully
All tests pass

Create or update:

README.md
docs/current-state-analysis.md
docs/architecture.md
docs/database-design.md
docs/api-guide.md
docs/deployment.md
docs/admin-user-guide.md
docs/privacy-and-data-handling.md

23. Copilot working method

Work incrementally.

For every task:

Inspect the relevant existing files.
Summarize what currently exists.
Explain the proposed change briefly.
List the files that will be created or modified.
Implement one coherent feature.
Add or update tests.
Run formatting.
Run linting.
Run TypeScript type checking.
Run backend compilation.
Run tests.
Fix failures.
Summarize completed work.
Identify the next task.

Do not generate the entire application in one uncontrolled response.

Do not overwrite working Figma-generated components without first explaining why.

Do not invent repository files.

Do not claim that a command passed unless it was actually run.

When something cannot be completed because credentials or provider configuration are missing, create a clear interface, configuration placeholder, and documented TODO without pretending the integration is active.

24. Coding standards
Kotlin
Use idiomatic Kotlin
Use constructor injection
Keep controllers thin
Put business logic in services
Use data classes for DTOs
Use enums for controlled values
Avoid unnecessary nullable values
Use transactions where appropriate
Do not expose entities directly
Add KDoc for non-obvious business logic
TypeScript
Use strict TypeScript
Avoid any
Use typed API responses
Reuse existing components
Keep components focused
Preserve the existing design system
Handle loading and errors explicitly
Avoid unnecessary global state
SQL
Use clear names
Add foreign keys
Add useful indexes
Add check constraints
Avoid unsafe cascade deletion
Protect data integrity at database level

25. Definition of done

A feature is complete only when:

The database migration exists
The backend entity exists
The repository exists
The service exists
The API endpoint exists
Validation exists
Authorization is correct
Error handling exists
The frontend is connected
Loading state exists
Empty state exists
Error state exists
Success state exists
Mobile layout still works
Tests exist
Documentation is updated
Sensitive data is protected
Existing working UI is not unnecessarily broken

Start with:

A — Analyze the existing repository

Inspect the real project files first and create:

docs/current-state-analysis.md

Do not begin by generating random backend or frontend files before completing the repository analysis.
