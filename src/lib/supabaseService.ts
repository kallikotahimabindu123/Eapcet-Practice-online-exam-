import { supabase } from './supabase';

/**
 * Submit an exam to the Supabase `exam_submissions` table.
 * Returns a consistent object: { ok: true, submission } on success or { error: true, message } on failure.
 */
export async function submitExam(submissionData: any) {
  try {
    const payload = {
      exam_id: submissionData.exam_id,
      student_id: submissionData.user_id ?? submissionData.student_id ?? null,
      answers: submissionData.answers,
      score: submissionData.score ?? null,
      total_marks: submissionData.total_marks ?? null,
      time_taken: submissionData.time_taken ?? null,
      submitted_at: submissionData.finished_at ?? new Date().toISOString(),
      tab_switch_count: submissionData.tab_switch_count ?? 0,
      suspicious_activity: submissionData.suspicious_activity ?? [],
      status: (submissionData.tab_switch_count ?? 0) > 5 ? 'suspicious' : 'submitted',
    };

    const { data, error } = await supabase
      .from('exam_submissions')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('supabaseService.submitExam DB error', error);
      return { error: true, message: (error as any)?.message || 'DB error' };
    }

    return { ok: true, submission: data };
  } catch (e: any) {
    console.error('supabaseService.submitExam exception', e);
    return { error: true, message: e?.message || 'Server error' };
  }
}