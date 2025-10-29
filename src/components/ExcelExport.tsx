import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { supabase } from '../lib/supabase';

interface ExcelExportProps {
  className?: string;
}

export const ExcelExport: React.FC<ExcelExportProps> = ({ className = '' }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const exportAllSubjects = async () => {
    setIsExporting(true);
    try {
      // Fetch questions for all subjects
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .order('subject', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!questions || questions.length === 0) {
        alert('No questions found to export');
        return;
      }

      // Group questions by subject
      const questionsBySubject = questions.reduce((acc, question) => {
        const subject = question.subject || 'unknown';
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(question);
        return acc;
      }, {} as Record<string, any[]>);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add worksheet for each subject
      Object.entries(questionsBySubject).forEach(([subject, subjectQuestions]) => {
        const worksheetData = subjectQuestions.map((q, index) => ({
          'S.No': index + 1,
          'Subject': q.subject?.toUpperCase() || 'UNKNOWN',
          'Topic': q.topic || 'General',
          'Question': q.question_text,
          'Option A': q.options?.A || '',
          'Option B': q.options?.B || '',
          'Option C': q.options?.C || '',
          'Option D': q.options?.D || '',
          'Correct Answer': q.correct_answer,
          'Marks': q.marks || 4,
          'Difficulty': q.difficulty?.toUpperCase() || 'MEDIUM',
          'Explanation': q.explanation || '',
          'Image URL': q.image_url || '',
          'Created Date': new Date(q.created_at).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        
        // Set column widths
        const colWidths = [
          { wch: 8 },   // S.No
          { wch: 12 },  // Subject
          { wch: 15 },  // Topic
          { wch: 50 },  // Question
          { wch: 25 },  // Option A
          { wch: 25 },  // Option B
          { wch: 25 },  // Option C
          { wch: 25 },  // Option D
          { wch: 12 },  // Correct Answer
          { wch: 8 },   // Marks
          { wch: 12 },  // Difficulty
          { wch: 30 },  // Explanation
          { wch: 20 },  // Image URL
          { wch: 12 }   // Created Date
        ];
        worksheet['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, subject.toUpperCase());
      });

      // Add summary sheet
      const summaryData = Object.entries(questionsBySubject).map(([subject, subjectQuestions]) => ({
        'Subject': subject.toUpperCase(),
        'Total Questions': subjectQuestions.length,
        'Easy Questions': subjectQuestions.filter(q => q.difficulty === 'easy').length,
        'Medium Questions': subjectQuestions.filter(q => q.difficulty === 'medium').length,
        'Hard Questions': subjectQuestions.filter(q => q.difficulty === 'hard').length,
        'With Images': subjectQuestions.filter(q => q.image_url).length,
        'Total Marks': subjectQuestions.reduce((sum, q) => sum + (q.marks || 4), 0)
      }));

      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
      summaryWorksheet['!cols'] = [
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'SUMMARY');

      // Generate file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `EAPCET_Questions_All_Subjects_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(data, fileName);

      alert(`Excel file exported successfully with ${Object.keys(questionsBySubject).length} subjects!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export Excel file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportBySubject = async (subject: 'mathematics' | 'physics' | 'chemistry') => {
    setIsExporting(true);
    try {
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', subject)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!questions || questions.length === 0) {
        alert(`No ${subject} questions found to export`);
        return;
      }

      const worksheetData = questions.map((q, index) => ({
        'S.No': index + 1,
        'Subject': q.subject?.toUpperCase() || 'UNKNOWN',
        'Topic': q.topic || 'General',
        'Question': q.question_text,
        'Option A': q.options?.A || '',
        'Option B': q.options?.B || '',
        'Option C': q.options?.C || '',
        'Option D': q.options?.D || '',
        'Correct Answer': q.correct_answer,
        'Marks': q.marks || 4,
        'Difficulty': q.difficulty?.toUpperCase() || 'MEDIUM',
        'Explanation': q.explanation || '',
        'Image URL': q.image_url || '',
        'Created Date': new Date(q.created_at).toLocaleDateString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      
      // Set column widths
      const colWidths = [
        { wch: 8 }, { wch: 12 }, { wch: 15 }, { wch: 50 }, { wch: 25 }, { wch: 25 }, 
        { wch: 25 }, { wch: 25 }, { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 30 }, 
        { wch: 20 }, { wch: 12 }
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, subject.toUpperCase());

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `EAPCET_${subject.toUpperCase()}_Questions_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(data, fileName);

      alert(`${subject.toUpperCase()} questions exported successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export Excel file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Export Questions</h3>
      
      {/* Export All Subjects */}
      <button
        onClick={exportAllSubjects}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exporting...' : 'Export All Subjects (Combined)'}
      </button>

      {/* Export Individual Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <button
          onClick={() => exportBySubject('mathematics')}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Mathematics
        </button>
        
        <button
          onClick={() => exportBySubject('physics')}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Physics
        </button>
        
        <button
          onClick={() => exportBySubject('chemistry')}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Chemistry
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-2">
        Export all subjects in one file or individual subject files with complete question details.
      </p>
    </div>
  );
};