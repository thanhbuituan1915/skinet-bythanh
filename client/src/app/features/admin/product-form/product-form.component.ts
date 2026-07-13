import { Component, Inject, OnInit, inject } from '@angular/core'; // Keep inject here
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Added ReactiveFormsModule
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; // Standard way to import
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true, // Assuming this is standalone
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule, // Required for [formGroup]
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;
  isEditMode = false;

  // Use 'inject' for services to avoid constructor token errors
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private dialogRef = inject(MatDialogRef<ProductFormComponent>);
  private data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.isEditMode = !!this.data?.product;
    this.productForm = this.fb.group({
      name: [
        this.data?.product?.name || '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9 -]+$'), // This blocks special characters
        ],
      ],
      description: [this.data?.product?.description || '', Validators.required],
      price: [this.data?.product?.price || 0, [Validators.required, Validators.min(0.01)]],
      type: [this.data?.product?.type || '', Validators.required],
      brand: [this.data?.product?.brand || '', Validators.required],
      quantityInStock: [
        this.data?.product?.quantityInStock || 0,
        [Validators.required, Validators.min(0)],
      ],
      discountPercentage: [
        this.data?.product?.discountPercentage || 0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    Object.keys(this.productForm.value).forEach((key) => {
      formData.append(key, this.productForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append('pictureUrl', this.selectedFile);
    }

    if (this.isEditMode) {
      this.productService
        .updateProduct(this.data.product.id, formData)
        .subscribe(() => this.dialogRef.close(true));
    } else {
      this.productService.createProduct(formData).subscribe(() => this.dialogRef.close(true));
    }
  }
}
