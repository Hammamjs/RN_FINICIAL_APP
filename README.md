Financial Management Mobile App

A React Native mobile application for a financial management platform, built to provide a mobile experience alongside an existing web application.

The mobile application connects to an existing Node.js/Express backend that powers the platform's backend services and the existing website. The React Native application consumes the same backend APIs to provide users and administrators with a mobile interface.

Project Status: In Development

Overview

This project is the mobile application for an existing financial platform.

The platform consists of:

An existing web application
An existing Node.js/Express backend
This React Native mobile application

Rather than creating a separate backend specifically for mobile, the application communicates with the existing backend through its API layer.

                    ┌─────────────────────┐
                    │   Node.js / Express │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐       ┌─────────────────┐
        │ Existing Website│       │ React Native    │
        │                 │       │ Mobile App      │
        │     React       │       │                 │
        └─────────────────┘       └─────────────────┘

This architecture allows the web and mobile applications to share the same backend services, business rules, authentication system, and data.

Application Features

The mobile application is organized around several core areas of the financial platform.

Authentication

The authentication system connects to the existing backend authentication services.

Features include:

User registration
User sign-in
Google sign-in
Password recovery
Reset-code verification
Password reset
Authentication sessions
Token refresh
Secure token storage
Logout

The authentication layer is separated into API services, hooks, session management, validation schemas, and state management.

Accounts

Users can manage their financial accounts through the mobile application.

The accounts feature includes:

Account listing
Account information
Adding accounts
Account validation
Reusable account components
Transfers

The application provides a mobile interface for financial transfers.

The transfer flow includes:

Transfer initiation
Transfer details
Currency conversion
Transfer-related API communication
Transfer UI components

The mobile application relies on the existing backend for processing and managing transfer-related operations.

Currencies

The currency feature communicates with the backend currency services.

It provides the foundation for:

Retrieving supported currencies
Displaying currency information
Currency conversion
Currency-related financial operations
Orders

Users can access their financial orders through the mobile application.

The orders feature contains:

Orders API integration
Order listing
Order-related components
Order data types
Notifications

The application provides users with access to their notifications.

The notification architecture supports:

User notifications
Notification API integration
Broadcast notifications
Notification-related hooks and components
User Profile

Users can manage their account information through the mobile application.

The user feature includes:

User profiles
Profile management
User information
User search
User updates
User role management
Admin Application

The mobile application also contains a dedicated administrative experience.

Administrators have access to a separate set of screens and features.

Admin
│
├── Dashboard
├── Users
├── Currencies
├── Broadcast
├── Account
└── Admin Profile

Administrative functionality communicates with the same existing Node.js/Express backend.

The separation between user and administrator routes helps keep role-specific functionality organized.

Project Architecture

The React Native application uses a feature-based architecture.

src/
├── app/
├── constants/
├── features/
├── i18n/
└── shared/

app/

Contains application routes and screens.

app/
├── (admin)/
├── (auth)/
├── (user)/
├── index.tsx
├── onboarding.tsx
└── \_layout.tsx

The route structure separates:

Authentication
User functionality
Administrator functionality
Shared application routes
features/

Contains the application's business features.

features/
├── accounts/
├── auth/
├── currencies/
├── dashboards/
├── notifications/
├── orders/
├── transfers/
└── users/

Each feature is organized independently and can contain its own:

api/
components/
hooks/
schema/
services/
store/
types/

This keeps feature-specific logic separated and makes the application easier to maintain and extend.

shared/

Contains reusable functionality used throughout the application.

shared/
├── api/
├── components/
├── context/
├── hooks/
└── lib/

Examples include:

API fetcher
Theme management
Language management
Shared UI components
Authentication utilities
Error handling
Secure token storage
Role checking
Shared hooks
Backend Integration

The mobile application does not have a separate backend.

Instead, it communicates with the existing Node.js/Express backend through API services.

React Native
│
▼
Feature API Layer
│
▼
Shared API Fetcher
│
▼
Node.js / Express API
│
▼
Existing Backend Services
│
▼
Database

Each major feature has its own API layer where required.

For example:

features/
├── auth/
│ └── api/
├── currencies/
│ └── api/
├── orders/
│ └── api/
├── users/
│ └── api/
└── transfers/
└── api/

This keeps communication with the existing backend organized according to business features.

Authentication Architecture

Authentication is handled through a dedicated authentication module.

features/auth/

├── api/
├── components/
├── config/
├── hooks/
├── schema/
├── services/
├── store/
├── types/
└── utils/

The authentication module handles the mobile application's interaction with the existing backend authentication system.

It also provides:

Authentication state
Session handling
Access token management
Token refresh
Authenticated requests
Google authentication
Password management
Internationalization

The application supports multiple languages through the internal internationalization system.

i18n/
├── index.ts
└── locales/
├── ar.ts
└── en.ts

Current languages:

English
Arabic

Language state and translation functionality are exposed through shared contexts and hooks.

Theming

The application contains a centralized theme system.

constants/
└── theme.ts

Theme functionality is supported through shared providers and hooks, allowing UI components to use a consistent design system throughout the application.

Security

Because this application interacts with financial data and an existing backend, security is an important part of the mobile architecture.

The project includes dedicated functionality for:

Secure token storage
Authentication sessions
Token refresh
Authenticated API requests
Role verification
Password management
API error handling

The mobile application relies on the existing backend for authentication, authorization, validation, and business operations.

Production financial applications should additionally undergo appropriate security testing, backend security reviews, encryption reviews, auditing, monitoring, and compliance assessment.

Project Structure

Current source structure:

src/
├── app/
│ ├── (admin)/
│ ├── (auth)/
│ ├── (user)/
│ ├── index.tsx
│ ├── \_layout.tsx
│ └── onboarding.tsx
│
├── constants/
│ └── theme.ts
│
├── features/
│ ├── accounts/
│ ├── auth/
│ ├── currencies/
│ ├── dashboards/
│ ├── notifications/
│ ├── orders/
│ ├── transfers/
│ └── users/
│
├── i18n/
│ ├── index.ts
│ └── locales/
│ ├── ar.ts
│ └── en.ts
│
└── shared/
├── api/
├── components/
├── context/
├── hooks/
└── lib/

The current project contains approximately:

58 directories
107 files
Design Principles

The project is structured around several principles:

Feature-based architecture
Separation of UI and business logic
Reusable components
Centralized API communication
Shared authentication infrastructure
Separation of user and admin functionality
Type-safe development
Reusable hooks and services
Centralized theme management
Internationalization
Scalability
Relationship With Existing Platform

This mobile application is part of a larger existing platform rather than an isolated application.

                    Financial Platform
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      Existing Website            React Native App
             │                           │
             │                           │
             └───────────┬───────────────┘
                         │
                         ▼
                 Node.js / Express
                     Backend API
                         │
                         ▼
                      Database

Both clients can communicate with the same backend infrastructure, allowing the mobile application to extend the existing platform to mobile devices without duplicating backend functionality.

Development Status

The mobile application is currently under active development.

The project has established the main application architecture, navigation structure, authentication layer, feature modules, API integration structure, shared infrastructure, user functionality, and administrative functionality.

Further development will focus on completing, refining, testing, and expanding the mobile experience while maintaining compatibility with the existing backend.

Future Development

Potential areas for continued development include:

Additional financial features
Enhanced transfer workflows
Improved transaction history
Advanced financial analytics
Push notifications
Enhanced admin functionality
Improved error handling
Automated testing
Performance optimization
Security improvements
Additional localization
UI/UX refinement
License

This project is currently under development as part of an existing financial platform.

License and distribution information will be added according to the project's release requirements.
