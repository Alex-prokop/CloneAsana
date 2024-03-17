import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';


@Injectable({ providedIn: 'root' })
export class TaskService {
  private storageKey = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    this.loadInitialTasks();
  }

  private loadInitialTasks(): void {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    this.tasksSubject.next(tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  saveTask(task: Task): Observable<boolean> {
    let currentTasks = this.tasksSubject.value;
  
    if (task.id) {
      // Обновляем существующую задачу
      const index = currentTasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        currentTasks[index] = task;
      }
    } else {
      // Добавляем новую задачу
      task.id = uuidv4(); // Генерируем ID только для новых задач
      currentTasks = [...currentTasks, task];
    }
  
    localStorage.setItem(this.storageKey, JSON.stringify(currentTasks));
    this.tasksSubject.next(currentTasks);
    return of(true);
  }

  deleteTask(taskId: string): Observable<boolean> {
    const tasks = this.tasksSubject.value.filter(task => task.id !== taskId);
    this.tasksSubject.next(tasks);
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    return of(true); 
  }
}
