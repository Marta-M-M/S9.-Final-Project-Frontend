
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-event-dialog-edit',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  templateUrl: './event-dialog-edit.component.html',
  styleUrls: ['./event-dialog-edit.component.scss']
})
export class EventDialogEditComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EventDialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: any }
  ) {}

  ngOnInit(): void {
    // Convertir las fechas a formato adecuado para datetime-local al iniciar
    this.data.event.start = this.convertDateToDateTimeLocal(this.data.event.start);
    this.data.event.end = this.convertDateToDateTimeLocal(this.data.event.end);
  }

  convertDateToDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);
    const ten = (i: number) => (i < 10 ? '0' : '') + i;
    const YYYY = date.getFullYear();
    const MM = ten(date.getMonth() + 1);
    const DD = ten(date.getDate());
    const HH = ten(date.getHours());
    const mm = ten(date.getMinutes());
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data);
  }
}
