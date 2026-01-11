
import React from 'react';
import { Task, Priority, Category } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  showCategoryBadge?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onUpdateProgress, showCategoryBadge }) => {
  const isCompleted = task.progress === 100;

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'bg-rose-100 text-rose-700 border-rose-200';
      case Priority.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
      case Priority.LOW: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryColor = (c: Category) => {
    switch (c) {
      case Category.FAMILY: return 'bg-purple-50 text-purple-600 border-purple-100';
      case Category.WORK: return 'bg-blue-50 text-blue-600 border-blue-100';
      case Category.TRAVEL: return 'bg-orange-50 text-orange-600 border-orange-100';
      case Category.MISC: return 'bg-slate-50 text-slate-600 border-slate-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProgress(task.id, e.target.checked ? 100 : 0);
  };

  return (
    <div className={`bg-white p-5 rounded-xl border transition-all group ${isCompleted ? 'border-slate-100 opacity-75 shadow-none' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="pt-1">
          <input 
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxChange}
            className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-lg text-slate-800 leading-tight transition-all ${isCompleted ? 'line-through text-slate-400' : ''}`}>
              {task.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            {showCategoryBadge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
          aria-label="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      {task.description && (
        <p className={`text-slate-500 text-sm mb-4 line-clamp-2 ${isCompleted ? 'text-slate-400' : ''}`}>{task.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 text-[10px] font-bold text-slate-400">
        <div>
          <p className="uppercase tracking-widest">Start</p>
          <p className={`${isCompleted ? 'text-slate-400' : 'text-slate-700'} mt-0.5`}>{new Date(task.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="uppercase tracking-widest">Due</p>
          <p className={`${isCompleted ? 'text-slate-400' : 'text-slate-700'} mt-0.5`}>{new Date(task.endDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span className="uppercase tracking-wider">Progress</span>
          <span>{task.progress}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={task.progress} 
          onChange={(e) => onUpdateProgress(task.id, parseInt(e.target.value))}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
    </div>
  );
};

export default TaskCard;
