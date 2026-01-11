
import React from 'react';
import { Task, Category } from '../types';

interface TaskSummaryProps {
  tasks: Task[];
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.progress === 100).length;
  const avgProgress = totalTasks > 0 
    ? Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / totalTasks) 
    : 0;

  // Calculate distribution by category
  const categories = [Category.FAMILY, Category.TRAVEL, Category.WORK, Category.MISC];
  const distribution = categories.map(cat => {
    const count = tasks.filter(t => t.category === cat).length;
    const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
    return { name: cat, count, percentage };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Overall Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Completion</h4>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-black text-indigo-600">{avgProgress}%</span>
            <span className="text-slate-400 text-sm mb-1 pb-1 font-medium">average</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-1000 ease-out" 
            style={{ width: `${avgProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-xs font-bold text-slate-500 uppercase">
          <span>{completedTasks} Done</span>
          <span>{totalTasks - completedTasks} Pending</span>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-2">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Task Distribution</h4>
        <div className="space-y-4">
          {distribution.map(item => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">{item.name}</span>
                <span className="text-slate-400">{item.count} tasks</span>
              </div>
              <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${
                    item.name === Category.WORK ? 'bg-blue-500' : 
                    item.name === Category.FAMILY ? 'bg-purple-500' : 
                    item.name === Category.TRAVEL ? 'bg-orange-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskSummary;
