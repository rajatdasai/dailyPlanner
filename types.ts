
export enum Category {
  ALL = 'All',
  FAMILY = 'Family',
  TRAVEL = 'Travel',
  WORK = 'Work',
  MISC = 'Miscellaneous'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum ViewFilter {
  TODAY = 'Today',
  OVERDUE = 'Overdue',
  THIS_WEEK = 'This Week',
  THIS_MONTH = 'This Month',
  FOREVER = 'Forever'
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  priority: Priority;
  progress: number;
  category: Category;
  createdAt: number;
}
