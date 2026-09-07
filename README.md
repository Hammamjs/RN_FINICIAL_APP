Financial Management Mobile App

A React Native mobile application for an existing financial management platform. The application extends the existing web platform to mobile devices while using the same Node.js and Express backend.

Project Status: In Development

Overview

This project is the mobile application for an existing financial platform.

The platform consists of:

An existing React web application
An existing Node.js / Express backend
A React Native mobile application

The mobile application does not have a separate backend. It communicates with the existing backend through API services and uses the same backend infrastructure as the existing web application.

                    Financial Platform
                           |
             +-------------+-------------+
             |                           |
             v                           v
     Existing Website            React Native App
          React                       Mobile
             |                           |
             +-------------+-------------+
                           |
                           v
                  Node.js / Express
                      Backend API
                           |
                           v
                        Database


This architecture allows both the web and mobile applications to share backend services, authentication, business logic, and data.

Features
Authentication

The mobile application integrates with the existing backend authentication system.

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

Authentication functionality is separated into API services, hooks, schemas, stores, and session management.

Accounts

The accounts feature provides functionality for managing user financial accounts.

Account listing
Account information
Add account
Account validation
Reusable account components
Transfers

The application provides a mobile interface for financial transfers.

Transfer initiation
Transfer details
Currency conversion
Transfer API integration
Transfer components

Transfer processing is handled by the existing backend.

Currencies

The currency feature communicates with the existing backend currency services.

Retrieve supported currencies
Display currency information
Currency conversion
Currency-related financial operations
Orders

Users can access their financial orders through the mobile application.

Orders API integration
Order listing
Order components
Order types
Notifications

The notification system provides users with access to platform notifications.

User notifications
Notification API integration
Broadcast notifications
Notification hooks and components
User Profile

Users can manage their profile and account information.

User profiles
Profile management
User information
User search
User updates
User role management
Admin Application

The application includes a dedicated administrative experience.

Administrators have access to:

Admin
|
+-- Dashboard
+-- Users
+-- Currencies
+-- Broadcast
+-- Account
+-- Admin Profile


Administrative functionality communicates with the same existing Node.js / Express backend.

User and administrator routes are separated to keep role-specific functionality organized.

Project Architecture

The React Native application follows a feature-based architecture.

src/
|
+-- app/
+-- constants/
+-- features/
+-- i18n/
+-- shared/


This structure separates application routing, business features, shared functionality, configuration, and internationalization.

Application Routes

The app directory contains the application's routes and screens.

app/
|
+-- (admin)/
|   +-- account.tsx
|   +-- admin-profile.tsx
|   +-- broadcast.tsx
|   +-- currencies.tsx
|   +-- dashboard.tsx
|   +-- _layout.tsx
|   +-- users.tsx
|
+-- (auth)/
|   +-- forgot-password.tsx
|   +-- _layout.tsx
|   +-- reset-password.tsx
|   +-- sign-in.tsx
|   +-- sign-up.tsx
|   +-- verify-reset-code.tsx
|
+-- (user)/
|   +-- _layout.tsx
|   +-- notifications.tsx
|   +-- orders.tsx
|   +-- profile.tsx
|   +-- transfer/
|       +-- details.tsx
|       +-- index.tsx
|       +-- _layout.tsx
|
+-- index.tsx
+-- _layout.tsx
+-- onboarding.tsx


The routes are organized into three main areas:

Authentication
User application
Administrator application
Features Directory

Business functionality is organized under the features directory.

features/
|
+-- accounts/
+-- auth/
+-- currencies/
+-- dashboards/
+-- notifications/
+-- orders/
+-- transfers/
+-- users/


Each feature is responsible for its own domain and can contain dedicated API services, components, hooks, schemas, stores, and types.

feature/
|
+-- api/
+-- components/
+-- hooks/
+-- schema/
+-- services/
+-- store/
+-- types/


This approach keeps feature-specific logic isolated and makes the application easier to maintain and extend.

Shared Layer

The shared directory contains functionality that is reused across multiple features.

shared/
|
+-- api/
+-- components/
|   +-- ui/
+-- context/
+-- hooks/
+-- lib/


The shared layer includes:

API fetcher
Reusable UI components
Theme providers
Language providers
Shared hooks
Authentication utilities
Error handling
Secure token storage
Role checking
Backend Integration

The React Native application communicates with the existing Node.js / Express backend.

React Native App
       |
       v
Feature API Layer
       |
       v
Shared API Fetcher
       |
       v
Node.js / Express API
       |
       v
Existing Backend Services
       |
       v
Database


API communication is organized by feature.

features/
|
+-- auth/
|   +-- api/
|
+-- currencies/
|   +-- api/
|
+-- orders/
|   +-- api/
|
+-- users/
|   +-- api/
|
+-- transfers/
    +-- api/


This allows each feature to communicate with the backend through a clearly defined API layer.

Authentication Architecture

Authentication is isolated within the auth feature.

features/auth/
|
+-- api/
+-- components/
+-- config/
+-- hooks/
+-- schema/
+-- services/
+-- store/
+-- types/
+-- utils/


The authentication module handles the mobile application's interaction with the existing backend authentication system.

It provides:

Authentication state
Session handling
Access token management
Token refresh
Authenticated requests
Google authentication
Password management
Internationalization

The application includes internationalization support.

i18n/
|
+-- index.ts
+-- locales/
    +-- ar.ts
    +-- en.ts


Currently supported languages:

English
Arabic

Language state and translation functionality are exposed through shared contexts and hooks.

Theming

The application uses a centralized theme system.

constants/
|
+-- theme.ts


Theme functionality is provided through shared providers and hooks, allowing components throughout the application to use a consistent design system.

Security

Because the application interacts with financial data, security is an important part of the architecture.

The mobile application includes functionality for:

Secure token storage
Authentication sessions
Token refresh
Authenticated API requests
Role verification
Password management
API error handling

The existing backend remains responsible for authentication, authorization, validation, and financial business operations.

For production use, additional security testing, auditing, monitoring, encryption reviews, and compliance assessments should be performed.

Full Project Structure
src/
|
+-- app/
|   |
|   +-- (admin)/
|   |   +-- account.tsx
|   |   +-- admin-profile.tsx
|   |   +-- broadcast.tsx
|   |   +-- currencies.tsx
|   |   +-- dashboard.tsx
|   |   +-- _layout.tsx
|   |   +-- users.tsx
|   |
|   +-- (auth)/
|   |   +-- forgot-password.tsx
|   |   +-- _layout.tsx
|   |   +-- reset-password.tsx
|   |   +-- sign-in.tsx
|   |   +-- sign-up.tsx
|   |   +-- verify-reset-code.tsx
|   |
|   +-- (user)/
|   |   +-- _layout.tsx
|   |   +-- notifications.tsx
|   |   +-- orders.tsx
|   |   +-- profile.tsx
|   |   +-- transfer/
|   |       +-- details.tsx
|   |       +-- index.tsx
|   |       +-- _layout.tsx
|   |
|   +-- index.tsx
|   +-- _layout.tsx
|   +-- onboarding.tsx
|
+-- constants/
|   +-- theme.ts
|
+-- features/
|   |
|   +-- accounts/
|   |   +-- components/
|   |   +-- schema/
|   |
|   +-- auth/
|   |   +-- api/
|   |   +-- components/
|   |   +-- config/
|   |   +-- hooks/
|   |   +-- schema/
|   |   +-- services/
|   |   +-- store/
|   |   +-- types/
|   |   +-- utils/
|   |
|   +-- currencies/
|   |   +-- api/
|   |   +-- components/
|   |   +-- types/
|   |
|   +-- dashboards/
|   |   +-- components/
|   |   +-- hooks/
|   |   +-- schema/
|   |   +-- store/
|   |   +-- types/
|   |
|   +-- notifications/
|   |   +-- api/
|   |   +-- components/
|   |   +-- hooks/
|   |   +-- types/
|   |
|   +-- orders/
|   |   +-- api/
|   |   +-- components/
|   |   +-- types/
|   |
|   +-- transfers/
|   |   +-- api/
|   |   +-- components/
|   |
|   +-- users/
|       +-- api/
|       +-- components/
|       +-- hooks/
|       +-- schema/
|       +-- store/
|
+-- i18n/
|   |
|   +-- index.ts
|   +-- locales/
|       +-- ar.ts
|       +-- en.ts
|
+-- shared/
    |
    +-- api/
    |   +-- fetcher.ts
    |   +-- index.ts
    |
    +-- components/
    |   +-- customMessage.tsx
    |   +-- LanguageProvider.tsx
    |   +-- onboardingComponent.tsx
    |   +-- screen.tsx
    |   +-- spinner.tsx
    |   +-- tabBarProvider.tsx
    |   +-- themeProvider.tsx
    |   +-- ui/
    |       +-- passwordInput.tsx
    |       +-- textInput.tsx
    |
    +-- context/
    |   +-- index.ts
    |   +-- languageContext.ts
    |   +-- tabBarContext.ts
    |   +-- themeContext.ts
    |
    +-- hooks/
    |   +-- index.ts
    |   +-- useTabBar.ts
    |   +-- useTheme.ts
    |   +-- useTranslation.ts
    |
    +-- lib/
        +-- catchError.ts
        +-- checkAdminRole.ts
        +-- secureTokenStorage.ts


The current project contains:

58 directories
107 files
Design Principles

The application is structured around the following principles:

Feature-based architecture
Separation of UI and business logic
Reusable components
Centralized API communication
Shared authentication infrastructure
Separation of user and administrator functionality
Type-safe development
Reusable hooks and services
Centralized theme management
Internationalization
Scalability
Existing Platform Architecture

The mobile application is part of an existing financial platform.

                    Financial Platform
                           |
             +-------------+-------------+
             |                           |
             v                           v
      Existing Website            React Native App
           React                       Mobile
             |                           |
             +-------------+-------------+
                           |
                           v
                  Node.js / Express
                      Backend API
                           |
                           v
                        Database


The existing website and React Native application use the same backend infrastructure.

This allows the mobile application to extend the existing platform to mobile devices without duplicating backend functionality.

Development Status

The mobile application is currently under active development.

The project includes the foundation for:

Application navigation
Authentication
User functionality
Administrator functionality
Account management
Transfers
Currency functionality
Orders
Notifications
API integration
Internationalization
Theme management

Development will continue with a focus on completing, testing, refining, and expanding the mobile experience while maintaining compatibility with the existing backend.

Future Development

Potential areas for future development include:

Enhanced financial features
Improved transfer workflows
Transaction history
Financial analytics
Push notifications
Enhanced administrator functionality
Automated testing
Performance optimization
Additional security improvements
Additional localization
UI and UX improvements
License

This project is currently under development as part of an existing financial platform.

License and distribution information will be added according to the project's release requirements.
