import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Order } from '../../shared/models/order';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdminService } from '../../core/services/admin.service';
import { OrderParams } from '../../shared/models/orderParams';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { DialogService } from '../../core/services/dialog.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator,
    MatButton,
    MatIcon,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    MatTable,
    MatTooltipModule,
    MatTabsModule,
    MatIconButton,
    RouterLink,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'status', 'total', 'actions'];
  dataSource = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  private productService = inject(ProductService);
  private router = inject(Router);
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];

  currentTabIndex = 0;
  productDisplayedColumns: string[] = [
    'pictureUrl',
    'name',
    'price',
    'type',
    'brand',
    'quantityInStock',
    'discountPercentage',
    'actions',
  ];

  productDataSource: any;
  totalProductItems = 0;
  typeOptions = ['Shoes', 'Boards', 'Hats', 'Gloves'];
  productParams = {
    pageIndex: 1,
    pageSize: 5,
    filter: '',
  };

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  onTabChange(event: MatTabChangeEvent) {
    this.currentTabIndex = event.index;
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: (response) => {
        if (response.data) {
          this.dataSource.data = response.data;
          this.totalItems = response.count;
        }
      },
    });
  }

  loadProducts() {
    this.productService.getProducts(this.productParams).subscribe({
      next: (response: any) => {
        this.productDataSource = response.data;
        this.totalProductItems = response.count;
      },
      error: (error) => {
        console.error('Failed to load products', error);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onFilterSelect(event: MatSelectChange) {
    (this, (this.orderParams.filter = event.value));
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }

  async openConfirmDialog(id: number) {
    const confirm = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure, this cant not be undone',
    );

    if (confirm) this.refundOrder(id);
  }

  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: (order) => {
        this.dataSource.data = this.dataSource.data.map((o) => (o.id == id ? order : o));
      },
    });
  }

  // 1. The Add Product button
  async openProductForm(product?: any) {
    const result = await this.dialogService.openProductForm(product);
    // If the dialog returns true, it means a product was saved
    if (result) {
      this.loadProducts();
    }
  }

  // 3. The Paginator
  onProductPageChange(event: any) {
    this.productParams.pageIndex = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  }

  // 4. View Detail
  viewProduct(id: number) {
    this.router.navigateByUrl('/shop/' + id);
  }

  // 5. Delete Product
  async deleteProduct(id: number) {
    const isConfirmed = await this.dialogService.confirm(
      'Confirm Delete',
      'Are you sure you want to delete this product? This action cannot be undone.',
    );

    if (isConfirmed) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log(`Successfully deleted product ${id}`);
          // Refresh the table so the deleted item disappears
          this.loadProducts();
        },
        error: (err) => {
          console.error('Failed to delete product:', err);
        },
      });
    }
  }

  async editProduct(product: any) {
    const result = await this.dialogService.openProductForm(product);

    if (result) {
      this.loadProducts();
    }
  }
}
