# EPMS

# Employee Performance Management System

This is an Employee Performance Management System designed to streamline employee performance tracking and management.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

    [Node.js](https://nodejs.org/)

Node.js includes npm (Node Package Manager), so you can verify npm installation by running the following command in your terminal:

    ```
    npm -v

    ```

### Server Setup

1.  Install `nodemon` globally on the server side:

    ```
    npm install nodemon

    ```

2.  Create a .env file in the server directory and add the following content:

        PORT=3000
        MONG_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.gxfsyqp.mongodb.net/

    Note: Replace `<USERNAME>` and `<PASSWORD>` with your MongoDB username and password.

### Client Setup

1.  Navigate to the "src" directory

    ```
    cd src

    ```

2.  Install project dependencies

        ```
        npm i

        ```

    or

        ```
        npm install

        ```

### Additional Dependencies

1.  Ensure you have the following dependencies installed:

        ```
        npm install @fortawesome/free-solid-svg-icons
        npm install chart.js
        npm install react-chartjs-2 chart.js
        npm install react-dnd react-dnd-html5-backend
        npm install react-router-dom (in case of any conflict between the version of react and react-dnd)

         ```

### Running the Application

1.  Open two terminals

    - one in the "server" directory
    - one in the "src" directory

2.  On the server side, run the following command to start the server with nodemon:

        ```
        nodemon index.js

        ```

    Wait for it to connect and listen on the specified port.

3.  On the src side, run the following command to start the client:

        ```
        npm start

        ```

    If you encounter a port conflict, you might see a prompt like:

    ```
    Would you like to run the app on another port instead? › (Y/n)

    ```

    Type 'y' or 'Y' to allow the React development server to run on an alternative port (e.g., 3001). This will launch the application in development mode, and you can access it at http://localhost:3001 in your browser.

### TroubleShooting

#### 1. Socket Connection Errors

**Problem:**
If you encounter socket connection errors, it may be due to network issues or problems with your MongoDB cluster.

**Solution:**

1. Ensure that your network connection is stable.
2. Check if your MongoDB cluster is running without issues.
3. Restart the MongoDB server and your application's server.

#### 2. Incorrect Connection String

**Problem:**
If you see authentication or connection errors, your MongoDB connection string might be incorrect.

**Solution:**

1. Double-check the MongoDB connection string in the `.env` file.
2. Verify that the username and password are correct.
3. Ensure that your IP address is whitelisted in your MongoDB Atlas cluster.

#### 3. Port Conflict

**Problem:**
If you encounter port conflicts when starting the server or client, it may affect the application's functionality.

**Solution:**

1. Choose an alternative port when prompted during the client startup.
2. Ensure no other applications are using the specified port.

#### 4. Application Not Responding

**Problem:**
If your application becomes unresponsive, it might be due to server issues.

**Solution:**

1. Check the server logs for any error messages or issues.
2. Inspect the browser console for client-side errors.

### Additional Notes

    - Environment Variables: Do not forget to add sensitive information (like API keys, database credentials) to the .gitignore file to avoid exposure on version control systems.
    - Axios Version: The version of Axios currently used in this project is axios@1.6.7.
      Please ensure your default browser is compatible with Axios. For example, Safari 17.0 may not fully support Axios.
