
import React, { useState, useMemo, useEffect } from 'react';
import { Category, Priority, ViewFilter, Task } from './types';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import TaskSummary from './components/TaskSummary';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zentask-data');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [activeView, setActiveView] = useState<ViewFilter>(ViewFilter.FOREVER);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('zentask-data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateProgress = (id: string, progress: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, progress } : t));
  };

  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return tasks.filter(task => {
      // Category Filter
      if (activeCategory !== Category.ALL && task.category !== activeCategory) {
        return false;
      }

      // View Filter
      const taskDate = new Date(task.endDate);
      taskDate.setHours(0, 0, 0, 0);

      switch (activeView) {
        case ViewFilter.TODAY:
          return taskDate.getTime() === today.getTime();
        case ViewFilter.OVERDUE:
          return taskDate.getTime() < today.getTime() && task.progress < 100;
        case ViewFilter.THIS_WEEK:
          return taskDate >= today && taskDate <= endOfWeek;
        case ViewFilter.THIS_MONTH:
          return taskDate >= today && taskDate <= endOfMonth;
        case ViewFilter.FOREVER:
        default:
          return true;
      }
    });
  }, [tasks, activeCategory, activeView]);

  return (
    <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">ZEN<span className="text-indigo-600">TASK</span></h1>
        </div>

        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Workspace</p>
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
                activeCategory === cat 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="flex-1 text-left">{cat}</span>
              <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md font-bold">
                {tasks.filter(t => cat === Category.ALL || t.category === cat).length}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Nav */}
      <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-30 px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Summary Visuals - Shown when viewing All or specifically selected category */}
        <TaskSummary tasks={tasks.filter(t => activeCategory === Category.ALL || t.category === activeCategory)} />

        {/* View Filters */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-2xl w-fit">
            {Object.values(ViewFilter).map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeView === view 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {activeCategory === Category.ALL ? 'Dashboard Overview' : activeCategory}
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              {filteredTasks.length} tasks {activeView === ViewFilter.FOREVER ? 'tracked' : `due ${activeView.toLowerCase()}`}
            </p>
          </div>
          {activeCategory !== Category.ALL && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 sm:w-auto w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
              Add New Task
            </button>
          )}
        </div>

        {/* Task Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={deleteTask} 
                onUpdateProgress={updateProgress}
                showCategoryBadge={activeCategory === Category.ALL}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Clear for now!</h3>
            <p className="text-slate-400 mt-1 text-sm font-medium">
              {activeCategory === Category.ALL 
                ? 'Your global task list is empty.' 
                : `No tasks found in the ${activeCategory} category.`}
            </p>
          </div>
        )}
      </main>

      {activeCategory !== Category.ALL && (
        <AddTaskModal 
          category={activeCategory} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addTask}
        />
      )}

      <footer className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 py-3 px-6 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest z-40">
        <div>ZenTask Manager &bull; Local</div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {tasks.filter(t => t.progress === 100).length} Done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            {tasks.filter(t => t.progress < 100).length} Open
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
