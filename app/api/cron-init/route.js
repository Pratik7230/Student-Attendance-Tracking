export async function GET() {
  return Response.json(
    {
      message: 'Cron job is disabled',
      status: 'disabled',
    },
    { status: 410 }
  );
}
