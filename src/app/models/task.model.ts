// src/app/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignees: User;
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export enum User {
  Peter = 'Петя',
  Vasya = 'Вася',
  Kolya = 'Коля',
}
