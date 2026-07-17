import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderParams } from '../../shared/models/orderParams';
import { Pagination } from '../../shared/models/pagination';
import { Order } from '../../shared/models/order';
import { ShopParams } from '../../shared/models/shopParams';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getOrders(orderParams: OrderParams) {
    let params = new HttpParams();
    if (orderParams.filter && orderParams.filter !== 'All') {
      params = params.append('status', orderParams.filter);
    }
    params = params.append('pageIndex', orderParams.pageNumber);
    params = params.append('pageSize', orderParams.pageSize);
    return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders', { params });
  }

  getOrder(id: number) {
    return this.http.get<Order>(this.baseUrl + 'admin/orders/' + id);
  }

  refundOrder(id: number) {
    return this.http.post<Order>(this.baseUrl + 'admin/orders/refund/' + id, {});
  }

  // Notice the special responseType: 'blob'
  downloadPurchaseOrder(id: number, quantity: number = 50) {
    return this.http.get(this.baseUrl + `products/export-po/${id}?quantity=${quantity}`, {
      responseType: 'blob',
    });
  }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    // Properly handle the arrays by joining them into comma-separated strings
    if (shopParams.brands && shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }
    if (shopParams.types && shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }

    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber);
    params = params.append('pageSize', shopParams.pageSize);
    if (shopParams.search) params = params.append('search', shopParams.search);

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', { params });
  }
}
