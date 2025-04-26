# PKL Absensi

PKL Absensi is a web-based attendance application that utilizes GPS lock radius and specific coordinates to ensure accurate location-based attendance tracking.

## Author

This project is developed by [@dendik-creation](https://github.com/dendik-creation).

## Tech Stack

### Backend

-   Laravel 11

### Frontend & Tools

-   Inertia.js with React and TypeScript
-   ShadCN UI
-   React-Leaflet
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
    cd pkl-absensi/server
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

## License

This project is licensed under the MIT License.
