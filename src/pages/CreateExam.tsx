import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 60
  });
  const [questions, setQuestions] = useState<{
    mathematics: any[];
    physics: any[];
    chemistry: any[];
  }>({
    mathematics: [],
    physics: [],
    chemistry: []
  });
  const [currentSubject, setCurrentSubject] = useState<'mathematics' | 'physics' | 'chemistry'>('mathematics');
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: [
      { id: 'a', text: '' },
      { id: 'b', text: '' },
      { id: 'c', text: '' },
      { id: 'd', text: '' }
    ],
    correctAnswer: '',
    marks: 4
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Upload-related state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState<string>('');
  const [uploadOriginalSheetName, setUploadOriginalSheetName] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleExamDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (field: string, value: any) => {
    setNewQuestion({
      ...newQuestion,
      [field]: value
    });
  };

  const handleOptionChange = (index: number, text: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index].text = text;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const addQuestion = () => {
    if (!newQuestion.questionText || !newQuestion.correctAnswer) {
      alert('Please fill in all required fields');
      return;
    }

    const question = {
      ...newQuestion,
      subject: currentSubject
    };

    setQuestions({
      ...questions,
      [currentSubject]: [...questions[currentSubject], question]
    });

    // Reset form
    setNewQuestion({
      questionText: '',
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' }
      ],
      correctAnswer: '',
      marks: 4
    });
  };

  const handleFileChange = (file?: File) => {
    setUploadError(null);
    if (!file) return;
    setUploadFile(file);
    parseExcelFile(file);
  };

  const parseExcelFile = (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('No file data');
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        setUploadOriginalSheetName(sheetName || '');
        const worksheet = workbook.Sheets[sheetName];
        const raw: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const parsed: any[] = [];
        for (const row of raw) {
          // Expecting columns: Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Subject, Marks
          const questionText = row['Question'] || row['question'] || row['QuestionText'] || row['questionText'];
          const optA = row['OptionA'] || row['optionA'] || row['A'] || row['a'] || '';
          const optB = row['OptionB'] || row['optionB'] || row['B'] || row['b'] || '';
          const optC = row['OptionC'] || row['optionC'] || row['C'] || row['c'] || '';
          const optD = row['OptionD'] || row['optionD'] || row['D'] || row['d'] || '';
          const correctRaw = (row['CorrectAnswer'] || row['correctAnswer'] || row['Answer'] || row['answer'] || '').toString();
          const subjectRaw = (row['Subject'] || row['subject'] || '').toString();
          const marksRaw = row['Marks'] || row['marks'] || 4;

          if (!questionText) continue; // skip empty rows

          const options = [
            { id: 'a', text: optA },
            { id: 'b', text: optB },
            { id: 'c', text: optC },
            { id: 'd', text: optD }
          ];

          // normalize correct answer
          let correctAnswer = '';
          if (correctRaw && correctRaw.length === 1 && /[a-dA-D]/.test(correctRaw)) {
            correctAnswer = correctRaw.toLowerCase();
          } else if (correctRaw) {
            // try match by option text
            const match = options.find((o) => o.text && o.text.toString().trim().toLowerCase() === correctRaw.toString().trim().toLowerCase());
            if (match) correctAnswer = match.id;
          }

          // normalize subject to our subject keys
          const subjectKey = (() => {
            const s = subjectRaw.toString().toLowerCase();
            if (s.includes('math')) return 'mathematics';
            if (s.includes('phys')) return 'physics';
            if (s.includes('chem')) return 'chemistry';
            return 'mathematics';
          })();

          parsed.push({
            questionText,
            options,
            correctAnswer,
            marks: Number(marksRaw) || 4,
            subject: subjectKey
          });
        }

        // merge parsed into state grouped by subject
        const grouped = { mathematics: [], physics: [], chemistry: [] } as any;
        for (const q of parsed) {
          grouped[q.subject].push(q);
        }

        setQuestions((prev) => ({
          mathematics: [...prev.mathematics, ...grouped.mathematics],
          physics: [...prev.physics, ...grouped.physics],
          chemistry: [...prev.chemistry, ...grouped.chemistry]
        }));

        setIsParsing(false);
      } catch (err) {
        console.error('Failed to parse excel', err);
        setUploadError('Failed to parse Excel file. Please ensure the columns are correct.');
        setIsParsing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const removeQuestion = (subject: 'mathematics' | 'physics' | 'chemistry', index: number) => {
    setQuestions({
      ...questions,
      [subject]: questions[subject].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalQuestions = questions.mathematics.length + questions.physics.length + questions.chemistry.length;
    if (totalQuestions === 0) {
      alert('Please add at least one question');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create exam
      const exam = await apiService.createExam(examData);

      // Bulk add questions (faster)
      const questionsToAdd: any[] = [];
      for (const subject of ['mathematics', 'physics', 'chemistry'] as const) {
        for (const question of questions[subject]) {
          questionsToAdd.push({
            examId: exam._id,
            subject,
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctAnswer,
            marks: question.marks
          });
        }
      }

      if (questionsToAdd.length > 0) {
        await apiService.addQuestions(questionsToAdd);
      }

      // If the admin uploaded an excel file and provided a name, save upload metadata
      if (uploadFile) {
        try {
          await apiService.saveUploadMetadata(exam._id, uploadName || uploadOriginalSheetName || 'Upload', uploadOriginalSheetName || '', uploadFile.name);
        } catch (metaErr) {
          console.warn('Failed to save upload metadata:', metaErr);
        }
      }

      alert('Exam created successfully!');
      navigate('/admin/manage-exams');
    } catch (error) {
      console.error('Failed to create exam:', error);
      alert('Failed to create exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case 'mathematics': return 'గణితం | Mathematics';
      case 'physics': return 'భౌతిక శాస్త్రం | Physics';
      case 'chemistry': return 'రసాయన శాస్త్రం | Chemistry';
      default: return subject;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Create New Exam</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Exam Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Exam Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={examData.title}
                  onChange={handleExamDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., EAPCET Mock Test 1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={examData.duration}
                  onChange={handleExamDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={examData.startTime}
                  onChange={handleExamDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={examData.endTime}
                  onChange={handleExamDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={examData.description}
                onChange={handleExamDataChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the exam..."
                required
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Add Questions</h2>

            {/* Excel Upload Area */}
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Upload Questions from Excel</h3>
              <p className="text-sm text-gray-600 mb-3">You can upload an Excel with columns: Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Subject, Marks</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sheet / Upload Name (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Physics Set A"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-2">{isParsing ? 'Parsing file...' : uploadFile ? `Loaded: ${uploadFile.name}` : 'No file loaded'}</div>
                  <div className="flex justify-end space-x-2">
                    {uploadFile && (
                      <button
                        type="button"
                        onClick={() => { setUploadFile(null); setUploadOriginalSheetName(''); setUploadName(''); setUploadError(null); }}
                        className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {uploadError && <div className="mt-3 text-sm text-red-600">{uploadError}</div>}
            </div>

            {/* Subject Tabs */}
            <div className="flex space-x-1 mb-6">
              {(['mathematics', 'physics', 'chemistry'] as const).map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setCurrentSubject(subject)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    currentSubject === subject
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getSubjectName(subject)} ({questions[subject].length})
                </button>
              ))}
            </div>

            {/* Add Question Form */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">
                Add Question to {getSubjectName(currentSubject)}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text
                  </label>
                  <textarea
                    value={newQuestion.questionText}
                    onChange={(e) => handleQuestionChange('questionText', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter the question..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newQuestion.options.map((option, index) => (
                    <div key={option.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option {option.id.toUpperCase()}
                      </label>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Option ${option.id.toUpperCase()}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <select
                      value={newQuestion.correctAnswer}
                      onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select correct answer</option>
                      {newQuestion.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          Option {option.id.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={newQuestion.marks}
                      onChange={(e) => handleQuestionChange('marks', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            {questions[currentSubject].length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Questions in {getSubjectName(currentSubject)} ({questions[currentSubject].length})
                </h3>
                <div className="space-y-4">
                  {questions[currentSubject].map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeQuestion(currentSubject, index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-gray-700 mb-2">{question.questionText}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {question.options.map((option: any) => (
                          <div key={option.id} className={option.id === question.correctAnswer ? 'font-semibold text-green-600' : ''}>
                            {option.id.toUpperCase()}: {option.text}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Marks: {question.marks}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Creating Exam...' : 'Create Exam'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateExam;