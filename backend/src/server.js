import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    const server = app.listen(ENV.PORT, () => {
      console.log(`===============================================`);
      console.log(`  StockFlow API running in [${ENV.NODE_ENV}] mode`);
      console.log(`  Port: http://localhost:${ENV.PORT}`);
      console.log(`  API Base: http://localhost:${ENV.PORT}/api/v1`);
      console.log(`===============================================`);
    });

    // Graceful Shutdown
    const handleShutdown = (signal) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('[Server Error] Failed to bootstrap application:', error.message);
    process.exit(1);
  }
};

startServer();

