import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  inputData: any

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.inputData = data
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close({ event: "Ok" });
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }

}
