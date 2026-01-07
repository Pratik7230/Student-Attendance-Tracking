import cron from 'node-cron';
import { db } from '@/utils';
import { GRADES } from '@/utils/schema';

let cronJobStarted = false;

// Function to format timestamp for console logs
function getTimestamp() {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

// Function to keep database connection alive
async function keepDatabaseAlive() {
  const startTime = Date.now();
  console.log(`\n[${getTimestamp()}] 🔄 Starting database keep-alive check...`);
  
  try {
    // Simple query to keep the connection active
    const result = await db.select().from(GRADES).limit(1);
    const duration = Date.now() - startTime;
    
    console.log(`[${getTimestamp()}] ✅ Database keep-alive: Connection active`);
    console.log(`[${getTimestamp()}] 📊 Query executed successfully in ${duration}ms`);
    console.log(`[${getTimestamp()}] 🔌 Database connection status: ONLINE`);
    console.log(`[${getTimestamp()}] ⏰ Next keep-alive check in 60 seconds\n`);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`\n[${getTimestamp()}] ❌ Database keep-alive ERROR:`);
    console.error(`[${getTimestamp()}] ⚠️  Error message: ${error.message}`);
    console.error(`[${getTimestamp()}] ⚠️  Error stack: ${error.stack}`);
    console.error(`[${getTimestamp()}] ⏱️  Failed after ${duration}ms`);
    console.error(`[${getTimestamp()}] 🔌 Database connection status: OFFLINE/ERROR\n`);
  }
}

// Initialize cron job - runs every 1 minute
export function startCronJob() {
  if (cronJobStarted) {
    console.log(`[${getTimestamp()}] ⚠️  Cron job already started - skipping initialization`);
    return;
  }

  console.log(`\n[${getTimestamp()}] 🚀 Initializing database keep-alive cron job...`);
  console.log(`[${getTimestamp()}] ⏰ Schedule: Every 1 minute (* * * * *)`);
  console.log(`[${getTimestamp()}] 🗄️  Database: ${process.env.DB_NAME || 'Not configured'}`);
  console.log(`[${getTimestamp()}] 🌐 Host: ${process.env.DB_HOST || 'Not configured'}`);

  // Cron expression: '* * * * *' means every minute
  const task = cron.schedule('* * * * *', () => {
    keepDatabaseAlive();
  }, {
    scheduled: true,
    timezone: "UTC"
  });

  console.log(`[${getTimestamp()}] ✅ Cron job started successfully!`);
  console.log(`[${getTimestamp()}] 🔄 Database keep-alive will run every 60 seconds`);
  cronJobStarted = true;
  
  // Run immediately on startup
  console.log(`[${getTimestamp()}] 🏃 Running initial database check...\n`);
  keepDatabaseAlive();
}

// Auto-start cron job when this module is imported (server-side only)
if (typeof window === 'undefined') {
  console.log(`[${getTimestamp()}] 📦 Cron module loaded (server-side)`);
  startCronJob();
} else {
  console.log(`[${getTimestamp()}] ⚠️  Cron module loaded (client-side) - cron will not start`);
}

