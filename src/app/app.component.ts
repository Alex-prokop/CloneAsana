import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskAddEditComponent } from './task-add-edit/task-add-edit.component';
import { TaskService } from './services/task.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { Task } from './models/task.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  displayedColumns: string[] = [
    // 'id',
    'title',
    'description',
    'deadline',
    'priority',
    'status',
    'assignees',
    'action'
  ];
  dataSource = new MatTableDataSource<Task>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _taskService: TaskService,
    private _coreService: CoreService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.dataSource.data = tasks;
    });
  }

  openAddEditTaskForm() {
    const dialogRef = this._dialog.open(TaskAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTasks();
        }
      },
    });
  }

  getTasks() {
    this._taskService.getTasks().subscribe({
      next: (res) => {
        console.log('Tasks:', res); // Добавьте эту строку для отладки
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err); // Лучше использовать console.error для ошибок
      },
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteTask(id: string) {
    this._taskService.deleteTask(id).subscribe({
        next: (res: boolean) => {
            this._coreService.openSnackBar('Task deleted!', 'done');
            this.getTasks();
        },
        error: console.error,
    });
}

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(TaskAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTasks();
        }
      },
    });
  }
}