# Current State Analysis

## Overview

The repository is a React + TypeScript frontend for the Afaq Islamic Center website. The current implementation already includes a bilingual experience, an Arabic school experience, event cards/filters, a gallery page, and an admin page. However, most of the content and admin workflows are still frontend-only and rely on local state or browser storage rather than a real backend.

## What already works

- Bilingual UI is implemented through the language context in [src/app/contexts/LanguageContext.tsx](src/app/contexts/LanguageContext.tsx).
- The home page contains an Arabic school card and a donation modal in [src/app/pages/HomePage.tsx](src/app/pages/HomePage.tsx).
- The Arabic school page already has four tabs: registration, school hours, activities, and announcements in [src/app/pages/ArabicSchoolPage.tsx](src/app/pages/ArabicSchoolPage.tsx).
- The events page includes category and status filters with cards in [src/app/pages/EventsPage.tsx](src/app/pages/EventsPage.tsx).
- The gallery page renders a responsive gallery and lightbox in [src/app/pages/GalleryPage.tsx](src/app/pages/GalleryPage.tsx).
- The admin panel exists with gallery, school, and events sections in [src/app/pages/AdminPage.tsx](src/app/pages/AdminPage.tsx).

## What is frontend-only today

- Registration submission in [src/app/pages/ArabicSchoolPage.tsx](src/app/pages/ArabicSchoolPage.tsx) uses a mailto link instead of a backend API.
- School hours, activities, announcements, and event content are stored in localStorage through custom hooks inside pages.
- Gallery content is also stored in localStorage instead of a persistent backend.
- Admin access is protected by a hardcoded password in [src/app/pages/AdminPage.tsx](src/app/pages/AdminPage.tsx).
- The admin page uses a hidden dot in [src/app/App.tsx](src/app/App.tsx) to access the admin area, which is an insecure temporary model.
- The donation modal currently shows static payment instructions and does not implement a real payment abstraction or backend flow.

## What must be preserved

- The existing visual design and bilingual structure should remain intact.
- The Arabic school page layout, tabs, and validation style should be preserved.
- The events page category pills, filters, and card design should be preserved.
- The home page Arabic school card and donation modal should remain visually similar.
- The admin UI structure with gallery, school, and events tabs should be preserved while moving functionality to a secure backend.

## What must be replaced

- Registration: replace mailto submission with a typed REST API call and backend persistence.
- Admin authentication: remove the hardcoded password model and replace it with a proper login flow backed by Spring Security.
- Content persistence: move school schedules, activities, announcements, events, and gallery metadata from localStorage to PostgreSQL-backed APIs.
- Payment flow: replace the static-only donation experience with a backend abstraction that can later support a real provider.
- Security: remove the invisible admin-access dot and client-side-only auth.

## Security risks

- Hardcoded admin password in the frontend.
- Client-side-only authentication using sessionStorage.
- Hidden access control mechanism in the app shell.
- No backend enforcement for protected actions.
- No protected API layer yet.

## Required backend endpoints

The prompt requires a backend that provides:

- Public endpoints for classrooms, registrations, school schedules, activities, announcements, events, gallery, and donations.
- Admin endpoints for managing registrations, schedules, activities, announcements, events, gallery, and donations.
- Authentication endpoints for login, logout, and current-user info.

## Expected file changes

### Frontend

- Add a typed API layer under [src/api](src/api) (new).
- Replace localStorage-driven forms and content with API-backed state.
- Update [src/app/pages/ArabicSchoolPage.tsx](src/app/pages/ArabicSchoolPage.tsx) to submit registrations to the backend.
- Update [src/app/pages/HomePage.tsx](src/app/pages/HomePage.tsx) to keep the current Arabic school card and donation modal while connecting to the new API layer.
- Update [src/app/pages/EventsPage.tsx](src/app/pages/EventsPage.tsx) to load events from the backend.
- Update [src/app/pages/AdminPage.tsx](src/app/pages/AdminPage.tsx) to use real login and protected admin flows.
- Update [src/app/App.tsx](src/app/App.tsx) to remove the invisible admin-access dot.

### Backend

- Create a new backend module with Spring Boot + Kotlin.
- Add Gradle build configuration, Spring Security, Flyway migrations, PostgreSQL integration, and DTO/service/repository structure.
- Add authentication, data entities, and API controllers for school, events, gallery, donations, and admin management.

## Recommended next step

The next step is to bootstrap the backend structure and create the initial API foundation without changing the existing UI design. After that, the frontend can be connected incrementally to the new backend endpoints.
