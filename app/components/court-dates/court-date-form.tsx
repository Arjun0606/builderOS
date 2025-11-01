'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Case {
  id: string;
  case_title: string;
  case_number: string;
}

interface CourtDateFormProps {
  organizationId: string;
  cases: Case[];
  courtDate?: any; // For editing
}

export function CourtDateForm({ organizationId, cases, courtDate }: CourtDateFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    case_id: courtDate?.case_id || '',
    hearing_date: courtDate?.hearing_date?.split('T')[0] || '',
    hearing_time: courtDate?.hearing_time || '',
    court_name: courtDate?.court_name || '',
    court_location: courtDate?.court_location || '',
    hearing_type: courtDate?.hearing_type || 'hearing',
    purpose: courtDate?.purpose || '',
    notes: courtDate?.notes || '',
    reminder_enabled: courtDate?.reminder_enabled ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        organization_id: organizationId,
      };

      if (courtDate) {
        // Update existing
        const { error } = await supabase
          .from('court_dates')
          .update(dataToSave)
          .eq('id', courtDate.id);

        if (error) throw error;
        toast.success('Court date updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('court_dates')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Court date added successfully');
      }

      router.push('/dashboard/court-dates');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving court date:', error);
      toast.error(error.message || 'Failed to save court date');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
        {/* Case Selection */}
        <div>
          <label htmlFor="case_id" className="block text-sm font-medium text-slate-700 mb-2">
            Case <span className="text-red-500">*</span>
          </label>
          <select
            id="case_id"
            name="case_id"
            value={formData.case_id}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select a case</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.case_number} - {c.case_title}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="hearing_date" className="block text-sm font-medium text-slate-700 mb-2">
              Hearing Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="hearing_date"
              name="hearing_date"
              value={formData.hearing_date}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label htmlFor="hearing_time" className="block text-sm font-medium text-slate-700 mb-2">
              Hearing Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="hearing_time"
              name="hearing_time"
              value={formData.hearing_time}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Court Details */}
        <div>
          <label htmlFor="court_name" className="block text-sm font-medium text-slate-700 mb-2">
            Court Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="court_name"
            name="court_name"
            value={formData.court_name}
            onChange={handleChange}
            placeholder="e.g., Delhi High Court, Court Room 5"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label htmlFor="court_location" className="block text-sm font-medium text-slate-700 mb-2">
            Court Location
          </label>
          <input
            type="text"
            id="court_location"
            name="court_location"
            value={formData.court_location}
            onChange={handleChange}
            placeholder="e.g., Sher Shah Road, New Delhi"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Hearing Type */}
        <div>
          <label htmlFor="hearing_type" className="block text-sm font-medium text-slate-700 mb-2">
            Hearing Type <span className="text-red-500">*</span>
          </label>
          <select
            id="hearing_type"
            name="hearing_type"
            value={formData.hearing_type}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="hearing">Hearing</option>
            <option value="argument">Argument</option>
            <option value="judgment">Judgment</option>
            <option value="order">Order</option>
            <option value="mention">Mention</option>
            <option value="filing">Filing</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-2">
            Purpose
          </label>
          <input
            type="text"
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="e.g., Final arguments, Evidence submission"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional notes or reminders..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Reminder */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="reminder_enabled"
            name="reminder_enabled"
            checked={formData.reminder_enabled}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
          />
          <label htmlFor="reminder_enabled" className="text-sm text-slate-700">
            Send reminder (1 day before hearing)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : courtDate ? 'Update Court Date' : 'Add Court Date'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

