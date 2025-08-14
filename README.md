# Data Insights Dashboard

This is a full-stack web application that allows users to upload CSV datasets, visualize data in real-time, and perform predictive analysis. This version is containerized with Docker Compose for easy setup and deployment.

## Features

-   **User Authentication:** Secure user registration and login using JWT.
-   **CSV Upload:** Users can upload their own CSV files for analysis.
-   **Dynamic Visualization:** Interactive charts generated with Chart.js.
-   **Predictive Analytics:** Simple linear regression model using scikit-learn.
-   **Containerized Environment:** Easy setup with Docker and Docker Compose.
-   **Persistent Database:** PostgreSQL service managed by Docker Compose.

## Tech Stack

-   **Frontend:** React.js, Chart.js, Axios, Tailwind CSS
-   **Backend:** Flask, Python, Pandas, Scikit-learn
-   **Database:** PostgreSQL
-   **DevOps:** Docker, Docker Compose

## Setup and Installation

### Prerequisites

-   Docker and Docker Compose

### Running the Application

1.  **Clone the repository.**

2.  **Create the environment file:**
    Navigate to the `backend` directory and copy the template.
    ```bash
    cd backend
    cp .env.template .env
    ```
    You can leave the default values in the `.env` file as they are configured to work with `docker-compose`.

3.  **Run with Docker Compose:**
    From the root directory of the project, run:
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker image for the backend, start the PostgreSQL database, and run the application.

4.  **Run the Frontend:**
    In a separate terminal, navigate to the `frontend` directory and run:
    ```bash
    npm install
    npm start
    ```

The backend will be available at `http://localhost:5001` and the frontend at `http://localhost:3000`.
