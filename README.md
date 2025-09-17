### Project Name: Cat Mission Control

This is a full-stack web application for managing secret cat missions. The backend is built with Django REST Framework, and the frontend is built with Next.js and TypeScript.

## Features

### Backend (Django)

  * **Mission Management**: Create, read, update, and delete missions.
  * **Cat Assignment**: Assign a cat to a specific mission.
  * **Target Tracking**: Each mission can have multiple targets.
  * **Mission Status**: Mark missions as active or completed.
  * RESTful API endpoints for all core functionality.

### Frontend (Next.js)

  * A responsive single-page application built with **Next.js**, **React**, and **TypeScript**.
  * Utilizes **Tailwind CSS** for a modern and visually appealing design.
  * Allows users to:
      * View all current missions.
      * Create a new mission with its targets.
      * Assign a cat to an existing mission.
      * Mark a mission as completed.

## Technologies Used

  * **Backend**: Python, Django, Django REST Framework
  * **Frontend**: JavaScript, TypeScript, Next.js, React, Tailwind CSS

## Getting Started

### Prerequisites

  * Python 3.8+
  * Node.js 18+
  * npm or yarn
  * A PostgreSQL or SQLite database (PostgreSQL recommended for production)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/khrystyna1001/SCA.git
    cd SCA
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run migrations:**
    ```bash
    python manage.py migrate
    ```
5.  **Start the Django server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be running at `http://127.0.0.1:8000/`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Start the Next.js development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
    The frontend application will be available at `http://localhost:3000`.

## API Endpoints

The following are the main API endpoints provided by the Django backend:

  * **`GET /api/cats/missions/`**: Retrieve a list of all missions.
  * **`POST /api/cats/missions/`**: Create a new mission.
  * **`PATCH /api/cats/missions/{id}/assign_cat/`**: Assign a cat to a specific mission.
  * **`PATCH /api/cats/missions/{id}/complete_mission/`**: Mark a mission as completed.
  * **`DELETE /api/cats/missions/{id}/`**: Delete a mission.
