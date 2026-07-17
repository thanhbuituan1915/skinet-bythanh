import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { Product } from '../../../shared/models/product';
import { ShopParams } from '../../../shared/models/shopParams';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-stock-management',
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.css',
})
export class StockManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  products: Product[] = [];
  shopParams = new ShopParams();
  totalCount = 0;

  ngOnInit(): void {
    this.getProducts();
  }

  onPageChange(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1; // Material is 0-indexed, our API is 1-indexed
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  getProducts() {
    // Force the API to return items with lowest stock first
    this.shopParams.sort = 'quantityAsc';

    this.adminService.getProducts(this.shopParams).subscribe({
      next: (response) => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
    });
  }

  exportPO(productId: number, productName: string) {
    this.adminService.downloadPurchaseOrder(productId, 50).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PO_${productName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
    });
  }
}
