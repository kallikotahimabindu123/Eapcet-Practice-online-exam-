import React from 'react';
import { Flag, X, Menu } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

interface SidebarNavigatorProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SidebarNavigator: React.FC<SidebarNavigatorProps> = ({ isOpen, onToggle }) => {
  const { examState, questions, navigateToQuestion } = useExam();

  const getQuestionStatus = (questionId: string, index: number) => {
    const state = examState.questionStates.get(questionId);
    const isCurrentQuestion = index === examState.currentQuestionIndex;

    if (state?.flagged) return 'flagged';
    if (state?.answered) return 'answered';
    if (state?.visited) return 'visited';
    return 'unvisited';
  };

  const getStatusColor = (status: string, isCurrentQuestion: boolean) => {
    const baseClasses = 'w-10 h-10 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors cursor-pointer';
    
    if (isCurrentQuestion) {
      return `${baseClasses} bg-blue-600 text-white ring-2 ring-blue-300`;
    }

    switch (status) {
      case 'answered':
        return `${baseClasses} bg-green-500 text-white hover:bg-green-600`;
      case 'flagged':
        return `${baseClasses} bg-orange-500 text-white hover:bg-orange-600`;
      case 'visited':
        return `${baseClasses} bg-red-500 text-white hover:bg-red-600`;
      default:
        return `${baseClasses} bg-gray-300 text-gray-700 hover:bg-gray-400`;
    }
  };

  const answeredCount = Array.from(examState.questionStates.values()).filter(state => state.answered).length;
  const flaggedCount = Array.from(examState.questionStates.values()).filter(state => state.flagged).length;
  const notAnsweredCount = questions.length - answeredCount;
  const visitedCount = Array.from(examState.questionStates.values()).filter(state => state.visited).length;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:relative top-0 right-0 h-full lg:h-auto w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        {/* Mobile close button */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 h-full overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Questions:</span>
              <span className="font-semibold">{questions.length}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Answered:</span>
              <span className="font-semibold">{answeredCount}</span>
            </div>
            <div className="flex justify-between text-red-700">
              <span>Not Answered:</span>
              <span className="font-semibold">{notAnsweredCount}</span>
            </div>
            <div className="flex justify-between text-orange-700">
              <span>Flagged for Review:</span>
              <span className="font-semibold">{flaggedCount}</span>
            </div>
            <div className="flex justify-between text-blue-700">
              <span>Attempted:</span>
              <span className="font-semibold">{visitedCount}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>Flagged for Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Current Question</span>
              </div>
            </div>
          </div>

          {/* Question Grid */}
          <div>
            <h4 className="font-medium mb-3">Questions</h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const status = getQuestionStatus(question.id, index);
                const isCurrentQuestion = index === examState.currentQuestionIndex;
                const state = examState.questionStates.get(question.id);
                
                return (
                  <div key={question.id} className="relative">
                    <button
                      onClick={() => {
                        navigateToQuestion(index);
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                      className={getStatusColor(status, isCurrentQuestion)}
                      title={`Question ${index + 1}${state?.flagged ? ' (Flagged)' : ''}${state?.answered ? ' (Answered)' : ''}`}
                    >
                      {index + 1}
                    </button>
                    {state?.flagged && (
                      <Flag className="absolute -top-1 -right-1 w-3 h-3 text-yellow-600 fill-current" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default SidebarNavigator;