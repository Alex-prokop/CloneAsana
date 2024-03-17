import { Component, OnInit, OnDestroy, Inject } from '@angular/core'; // Добавьте Inject
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-task-add-edit',
  templateUrl: './task-add-edit.component.html',
  styleUrls: ['./task-add-edit.component.scss']
})
export class TaskAddEditComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  private subscription: Subscription = new Subscription();

  priority: string[] = ['Low', 'Medium', 'High'];
  status: string[] = ['ToDo', 'InProgress', 'Done'];
  assignees: string[] = ['Петя', 'Вася', 'Коля'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      id: '',
      title: '',
      description: '',
      priority: '',
      deadline: '',
      status: '',
      assignees: '',
    });
  }

  ngOnInit(): void {
    if (this.dialogRef.componentInstance.data) {
      this.taskForm.setValue(this.dialogRef.componentInstance.data);
    }
  }

  ngOnDestroy(): void {
  }

  onFormSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = {
        id: uuidv4(),
        ...this.taskForm.value,
      };
      this.taskService.saveTask(task).subscribe({
        next: () => {
          this.dialogRef.close(true); 
          this.snackBar.open('Задача сохранена', 'Закрыть', { duration: 3000 });
        },
        error: (error: any) => { 
          console.error('Ошибка при сохранении задачи:', error);
          this.snackBar.open('Ошибка при сохранении задачи. Попробуйте снова.', 'Закрыть', { duration: 3000 });
        }
      });
    }
  }
  
}
