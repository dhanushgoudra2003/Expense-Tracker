const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002; // Fallback to 5000 if PORT is not in environment

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
readdirSync('./routes').map((route) => 
  app.use('/api/v1', require('./routes/' + route))
);

// Start server with error handling
const startServer = () => {
  try {
    db();  // Connect to DB
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // ✅ Graceful restart on Nodemon changes
    process.once('SIGUSR2', () => {
      server.close(() => {
        console.log('🔁 Server closed before restart');
        process.kill(process.pid, 'SIGUSR2');
      });
    });

    // ✅ Graceful shutdown on Ctrl+C
    process.on('SIGINT', () => {
      server.close(() => {
        console.log('🛑 Server closed from Ctrl+C');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit the process if server fails to start
  }
};

// Start the server
startServer();
