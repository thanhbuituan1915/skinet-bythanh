import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { MatDivider } from '@angular/material/divider';
import { MatSelect } from '@angular/material/select';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dialog',
  imports: [MatDivider, MatSelectionList, MatListOption, MatButton, FormsModule],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.css',
})
export class FilterDialogComponent {
  shopService = inject(ShopService);
  private dialogRef = inject(MatDialogRef<FilterDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  selectedBrands: string[] = [];
  selectedTypes: string[] = [];

  applyFilters() {
    this.dialogRef.close({
      selectedBrand: this.selectedBrands,
      selectedTypes: this.selectedTypes,
    });
  }
}
