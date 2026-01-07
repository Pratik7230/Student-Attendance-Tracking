import { startCronJob } from '@/lib/cron';

// Initialize cron job on first import
let cronInitialized = false;

if (!cronInitialized) {
  startCronJob();
  cronInitialized = true;
}

export async function GET() {
  return Response.json({ 
    message: 'Cron job initialized',
    status: 'running'
  });
}


