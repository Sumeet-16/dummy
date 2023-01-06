import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from './pop-up/pop-up.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'todolist';
  todos: any;
 term:any;
  
  readonly ROOT_API = 'https://localhost:7015/api/ToDos';

  currentSelectedId: string = '';

  constructor(private http: HttpClient, private dialogRef: MatDialog) { }

  ngOnInit() {
    this.getTodos();
  }

  submitForm(form: NgForm) {
    const { Description, Reporter, TaskName, TaskStatus } = form.value;

    const body = {
      description: Description,
      reporter: Reporter,
      taskName: TaskName,
      taskstatus: TaskStatus,
    };
    console.log(body);

    try {
      if (this.currentSelectedId && this.currentSelectedId.length) {
        this.http
          .put(`${this.ROOT_API}/${this.currentSelectedId}`, body, {})
          .subscribe((res) => {
            this.currentSelectedId = '';
            form.reset();

            this.openDialog("TODO Updated Successfully!");
          });
      } else {
        this.http.post(this.ROOT_API, body, {}).subscribe((res) => {
          this.currentSelectedId = '';
          form.reset();

          this.openDialog("TODO Created Successfully!");
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.getTodos();
  }

  getTodos() {
    this.http
      .get(this.ROOT_API)
      .subscribe((res: any) => this.todos = [...res]);
  }

  onDeleteTodo(id: any) {
    console.log(id);
    this.http.delete(`${this.ROOT_API}/${id}`, {}).subscribe();
    this.getTodos();
  }

  onEditTodo(id: any, form: NgForm) {
    console.log(id);

    const filterdData = this.todos.find((a: any) => a.id === id);
    form.setValue({
      Description: filterdData.description,
      Reporter: filterdData.reporter,
      TaskName: filterdData.taskName,
      TaskStatus: filterdData.taskstatus,
    });

    this.currentSelectedId = filterdData.id;
  }

  openDialog(message: string) {
    this.dialogRef.open(PopUpComponent, { data: { msg: message } });
  }
}
