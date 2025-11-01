import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendCourtDateReminder } from '@/lib/email';

/**
 * POST /api/notifications/court-reminder
 * Send court date reminder emails
 * This endpoint should be called by a cron job (Supabase cron or Vercel cron)
 */
export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get court dates for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const { data: courtDates, error } = await supabase
      .from('court_dates')
      .select(`
        *,
        cases (
          case_title,
          case_number,
          assigned_lawyers
        )
      `)
      .gte('hearing_date', tomorrow.toISOString())
      .lte('hearing_date', tomorrowEnd.toISOString())
      .eq('reminder_sent', false);

    if (error) {
      console.error('Error fetching court dates:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send reminders for each court date
    for (const courtDate of courtDates || []) {
      try {
        // Get assigned lawyers' emails
        const assignedLawyers = courtDate.cases.assigned_lawyers || [];
        
        for (const lawyerId of assignedLawyers) {
          const { data: lawyer } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', lawyerId)
            .single();

          if (lawyer) {
            const sent = await sendCourtDateReminder(
              lawyer.email,
              lawyer.full_name,
              {
                case_title: courtDate.cases.case_title,
                case_number: courtDate.cases.case_number,
                court_name: courtDate.court_name,
                hearing_date: courtDate.hearing_date,
                hearing_time: courtDate.hearing_time,
                hearing_type: courtDate.hearing_type,
              }
            );

            if (sent) {
              sentCount++;
            } else {
              failedCount++;
            }
          }
        }

        // Mark reminder as sent
        await supabase
          .from('court_dates')
          .update({ reminder_sent: true })
          .eq('id', courtDate.id);

      } catch (error) {
        console.error(`Error sending reminder for court date ${courtDate.id}:`, error);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      courtDates: (courtDates || []).length,
      sentCount,
      failedCount,
    });

  } catch (error: any) {
    console.error('Error in court reminder cron:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

