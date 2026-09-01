import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';

export default function TaskTimeTracker({
  estimatedHours = 0,
  trackedSeconds = 0,
  onSaveTime,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(trackedSeconds);

  useEffect(() => {
    setSeconds(trackedSeconds);
  }, [trackedSeconds]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(false);
    onSaveTime(seconds);
  };

  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" />
          Time Tracking
        </span>
        <span className="text-xs font-medium text-slate-500">
          Estimated: {estimatedHours ? `${estimatedHours}h` : 'Not set'}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Tracked Time</span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              type="button"
              onClick={() => setIsRunning(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRunning(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {seconds > 0 && (
            <button
              type="button"
              onClick={handleStop}
              className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
              title="Save Tracked Time"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
