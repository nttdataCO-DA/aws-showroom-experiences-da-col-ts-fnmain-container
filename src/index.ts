// import * as dotenv from 'dotenv';
// dotenv.config();

// import app from './app';
// import { config } from './common/config/default';
// //import { closeServiceBus, initializeServiceBus } from './deployment/controller/event.controller';

// const PORT = config.PORT;

// // Initialize Service Bus
// // initializeServiceBus().catch((err) => {
// //   console.error("Error initializing Service Bus client:", err);
// //   process.exit(1);
// // });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// process.on('SIGINT', async () => {
//   await closeServiceBus();
//   process.exit(0);
// });

// process.on('SIGTERM', async () => {
//   await closeServiceBus();
//   process.exit(0);
// });