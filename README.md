# Premium Interactive Calendar

A flagship-grade, production-ready interactive calendar built exclusively with **React**. This project features a sophisticated user interface, smooth cinematic transitions, and a robust event management system designed for a premium user experience.

## ✨ Key Features

*   **Premium React Architecture**: Built with a modular, component-based structure optimized for performance and scalability.
*   **User Isolation**: Integrated authentication flow with secure multi-tenant data scoping (Events are isolated per user).
*   **Refined Red UI Theme**: A modern, high-end design system using a deep red accent palette, glassmorphism containers, and professional typography.
*   **Cinematic Animations**: 
    *   Lamp-based dramatic introduction.
    *   Flipping page transitions for month navigation.
    *   Micro-interactions for buttons, focus states, and input fields.
*   **Seasonal Backgrounds**: Context-aware atmospheric effects (Snow in Winter, Rain in Monsoon, etc.) with mobile performance throttling.
*   **Event Management**: Full CRUD capabilities for managing professional and personal schedules.
*   **Guest Mode**: An accessible entry point for users to preview the premium experience without immediate signup.

## 🛠️ Tech Stack

*   **Core**: React
*   **Styling**: Tailwind CSS & Vanilla CSS
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **State Management**: React Life-cycle Hooks (useCallback, useMemo, useEffect)

## 🚀 Getting Started

1.  **Clone the project**:
    ```bash
    git clone https://github.com/preetham-18-developer/Interactive-Calendar.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🔐 Data Security

This application uses rigorous data isolation. Each user's events are stored and retrieved using unique identifiers in `localStorage`, preparing the architecture for seamless future integration with backend databases like Supabase or Firebase.

---
Built with passion for premium user experiences.
