import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

interface TimerProps {
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ onTimeUp }) => {
  const { examState, updateTimer } = useExam();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = Math.max(0, examState.timeRemaining - 1);
      updateTimer(newTime);

      // Show warnings
      if (newTime === 300 || newTime === 60) { // 5 minutes and 1 minute
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }

      if (newTime === 0) {
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.timeRemaining, updateTimer, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = examState.timeRemaining <= 300; // 5 minutes

  return (
    <>
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold ${
        isLowTime ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-blue-100 text-blue-800'
      }`}>
        <Clock className="w-5 h-5" />
        <span>{formatTime(examState.timeRemaining)}</span>
      </div>

      {showWarning && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">
            {examState.timeRemaining <= 60 ? 'Only 1 minute remaining!' : '5 minutes remaining!'}
          </span>
        </div>
      )}
    </>
  );
};

export default Timer;