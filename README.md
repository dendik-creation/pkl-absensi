# PKL Absensi

PKL Absensi is a web-based attendance application that utilizes GPS lock radius and specific coordinates to ensure accurate location-based attendance tracking.

## Author

This project is developed by [@dendik-creation](https://github.com/dendik-creation).

## Tech Stack

### Backend

-   Laravel 11
-   Inertia Server
-   FCM (Activate by user decision)

### Frontend & Tools

-   Inertia React TSX
-   ShadCN UI
-   React-Leaflet (Map)
-   Filepond
-   TailwindCSS 4

## Installation

Follow these steps to set up the project locally:

### Prerequisites

Ensure you have the following installed:

-   PHP >= 8.1
-   Composer
-   Node.js >= 18
-   NPM or Yarn
-   MySQL or any compatible database

### Steps

1. **Clone the Repository**

    ```bash
    git clone https://github.com/dendik-creation/pkl-absensi.git
    cd pkl-absensi/pkl-absensi
    ```

2. **Install Backend Dependencies**

    ```bash
    composer install
    ```

3. **Set Up Environment Variables**
   Copy the `.env.example` file to `.env` and configure your database and other environment settings:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Run Database Migrations**

    ```bash
    php artisan migrate
    ```

5. **Install Frontend Dependencies**

    ```bash
    npm install
    ```

6. **Build Frontend Assets**

    ```bash
    npm run dev
    ```

7. **Run the Development Server**

    ```bash
    php artisan serve
    ```

8. **Access the Application**
   Open your browser and navigate to `http://localhost:8000`.

## Features

-   GPS-based attendance tracking
-   Radius lock for location validation
-   Interactive map integration using React-Leaflet

## Docker Setup (Recommended)

This project includes a Docker setup for easy development environment configuration.

### Prerequisites for Docker

*   Docker Desktop (or Docker Engine and Docker Compose) installed on your system.

### Steps for Docker Setup

1.  **Clone the Repository (if you haven't already)**

    ```bash
    git clone https://github.com/dendik-creation/pkl-absensi.git
    cd pkl-absensi/pkl-absensi 
    ```
    *Note: If you've already cloned, just navigate to the project directory.*

2.  **Ensure `.env` file is configured**
    The `.env` file should have been created and configured in a previous step (or by the setup script if applicable). Specifically, ensure the database credentials match those in `docker-compose.yml`:
    *   `DB_CONNECTION=mysql`
    *   `DB_HOST=mysql`
    *   `DB_PORT=3306`
    *   `DB_DATABASE=laravel_db`
    *   `DB_USERNAME=laravel_user`
    *   `DB_PASSWORD=laravel_password`
    *   `APP_URL=http://localhost:8000`

    If `APP_KEY` is empty in your `.env` file, it will be generated in a later step.

3.  **Build and Start Docker Containers**
    Open your terminal in the project root directory and run:

    ```bash
    docker-compose up -d --build
    ```
    This command will build the images (if they don't exist or Dockerfiles have changed) and start the services in detached mode.

4.  **Install Backend Dependencies (Composer)**
    Once the containers are running, execute Composer install within the `php` container:

    ```bash
    docker-compose exec php composer install
    ```

5.  **Generate Application Key (if not set)**
    If you didn't have an `APP_KEY` in your `.env` file, generate one now:

    ```bash
    docker-compose exec php php artisan key:generate
    ```

6.  **Run Database Migrations**
    Execute the database migrations to set up your database schema:

    ```bash
    docker-compose exec php php artisan migrate
    ```
    You can also run seeders if available:
    ```bash
    docker-compose exec php php artisan db:seed 
    ```

7.  **Install Frontend Dependencies (NPM/Yarn)**
    Install the frontend dependencies using the `node` container:

    ```bash
    docker-compose exec node npm install
    ```

8.  **Build Frontend Assets**
    Compile your frontend assets. For development with hot-reloading:

    ```bash
    docker-compose exec node npm run dev
    ```
    For production build:
    ```bash
    docker-compose exec node npm run build
    ```
    *Note: `npm run dev` will keep running. You might need to run it in a separate terminal or manage it as a background process if your `docker-compose.yml` for the `node` service doesn't keep it alive.*

9.  **Access the Application**
    Open your browser and navigate to `http://localhost:8000` (or the port you configured for Nginx in `docker-compose.yml`).

### Common Docker Commands

*   **Stop Containers:**
    ```bash
    docker-compose down
    ```
*   **View Logs:**
    ```bash
    docker-compose logs -f <service_name> 
    # e.g., docker-compose logs -f php
    # or docker-compose logs -f nginx
    ```
*   **Access Shell in a Container:**
    ```bash
    docker-compose exec <service_name> bash
    # e.g., docker-compose exec php bash
    # or docker-compose exec node sh (Node image might use sh)
    ```

## License

This project is licensed under the MIT License.
