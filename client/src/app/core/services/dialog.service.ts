import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProductFormComponent } from '../../features/admin/product-form/product-form.component'; // Import your new component
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);

  // Existing confirm method
  confirm(title: string, message: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { title, message },
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  // NEW: Method to open the Product Form
  openProductForm(product?: any) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px', // Adjusted width for a form
      disableClose: true, // Prevents closing by clicking outside the modal
      data: { product }, // Passes the product object if editing, or undefined if creating
    });

    return firstValueFrom(dialogRef.afterClosed());
  }
}
