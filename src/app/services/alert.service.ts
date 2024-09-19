import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  dialogRef!: MatDialogRef<AlertDialogComponent>;

  constructor(private dialog: MatDialog) {}

  public open(options: any) {
    this.dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText,
      },
      panelClass: options.panelClass,
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      take(1)
    );
  }

}
