'use client'

import { Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface CourtDate {
  id: string;
  hearing_date: string;
  hearing_time: string;
  court_name: string;
  hearing_type: string;
  cases: {
    case_title: string;
    case_number: string;
  };
}

interface CourtDatesCalendarProps {
  courtDates: CourtDate[];
  currentMonth: number;
  currentYear: number;
}

export function CourtDatesCalendar({ courtDates, currentMonth, currentYear }: CourtDatesCalendarProps) {
  const router = useRouter();
  const currentDate = new Date(currentYear, currentMonth - 1);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Add padding days for the calendar grid
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => null);

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentDate, 1);
    router.push(`/dashboard/court-dates?month=${prevMonth.getMonth() + 1}&year=${prevMonth.getFullYear()}`);
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    router.push(`/dashboard/court-dates?month=${nextMonth.getMonth() + 1}&year=${nextMonth.getFullYear()}`);
  };

  const getEventsForDay = (day: Date) => {
    return courtDates.filter(cd => {
      const hearingDate = new Date(cd.hearing_date);
      return isSameDay(hearingDate, day);
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            Next
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-slate-600 pb-2">
            {day}
          </div>
        ))}

        {/* Padding days */}
        {paddingDays.map((_, i) => (
          <div key={`padding-${i}`} className="h-24 border border-slate-100 bg-slate-50 rounded-md" />
        ))}

        {/* Actual days */}
        {daysInMonth.map(day => {
          const events = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`h-24 border rounded-md p-2 ${
                isToday ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-slate-900'}`}>
                {format(day, 'd')}
              </div>
              <div className="mt-1 space-y-1">
                {events.slice(0, 2).map(event => (
                  <Link
                    key={event.id}
                    href={`/dashboard/court-dates/${event.id}`}
                    className="block text-xs bg-blue-100 text-blue-700 rounded px-1 py-0.5 truncate hover:bg-blue-200"
                  >
                    {event.hearing_time} - {event.court_name}
                  </Link>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-slate-500 px-1">
                    +{events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

