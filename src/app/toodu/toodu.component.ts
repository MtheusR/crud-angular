import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from './../shared/services/task.model';
import { TaskService } from './../shared/services/task.service';

@Component({
  selector: 'app-toodu',
  templateUrl: './toodu.component.html',
  styleUrls: ['./toodu.component.css', './toodu.componentTask.css', './toodu.componentLight.css'],
})
export class TooduComponent implements OnInit {
  saveBttActive = false;
  titleError = false;
  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: [null],
    dueDate: [null],
    completed: [false],
  });

  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isDarkMode = true;

  constructor(private fb: FormBuilder, private taskService: TaskService) { }

  ngOnInit(): void {
    this.fetchTasks();

    const switchEl = document.querySelector('.switch input') as HTMLInputElement;;

    if (localStorage.getItem("checked") == 'true') {
      switchEl.checked = true;
      this.isDarkMode = false;
    }
    if (localStorage.getItem("checked") == 'false') {
      switchEl.checked = false;
      this.isDarkMode = true;
    }
  }
  
  fetchTasks(): void {
    this.taskService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }
  
  toggleMode() {
    const switchEl = document.querySelector('.switch input') as HTMLInputElement;;
    
    if (switchEl.checked) {
      this.isDarkMode = false;
      localStorage.setItem("checked", "true");
      localStorage.setItem("isDarkMode", this.isDarkMode.toString());
    }
    else {
      this.isDarkMode = true;
      localStorage.setItem("checked", "false");
      localStorage.setItem("isDarkMode", this.isDarkMode.toString());
    }
  }
  
  onSubmit() {
    if (!this.taskForm.value.title) {
      this.titleError = true;
      return;
    }

    const newTask: Task = this.taskForm.value;
    this.taskService.addTask(newTask).subscribe((newTask) => {
      console.log('Task added successfully:', newTask);
      this.taskForm.reset();
      this.fetchTasks();
      this.titleError = false;
    });
  }

  toggleCompleted(task: Task): void {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed
    };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      console.log('Task updated successfully');
    });
  }


  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe(
      () => {
        this.fetchTasks();
      },
      (error) => console.log(error)
    );
  }

  selectTask(task: Task) {
    this.selectedTask = task;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      completed: task.completed
    });
    this.saveBttActive = true;
  }

  updateTask(): void {
    if (!this.selectedTask) {
      console.log('Nenhuma tarefa selecionada para atualizar');
      return;
    }

    const updatedTask: Task = {
      ...this.selectedTask,
      ...this.taskForm.value,
    };

    console.log('Tarefa atualizada:', updatedTask);

    this.taskService.updateTask(updatedTask).subscribe(() => {
      console.log('Tarefa atualizada com sucesso');
      this.selectedTask = null;
      this.taskForm.reset();
      this.fetchTasks();
    });
    this.saveBttActive = false;

  }
}
