import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(this.baseUrl + 'products', product);
  }

  // Update an existing product (expects FormData)
  updateProduct(id: number, product: FormData): Observable<void> {
    return this.http.put<void>(this.baseUrl + 'products/' + id, product);
  }

  // Delete a product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'products/' + id);
  }

  // Get products (needed for your admin dashboard table)
  // Ensure this matches your API controller's [FromQuery] params
  getProducts(params: any): Observable<any> {
    // You can use HttpParams to build your query string properly
    return this.http.get<any>(this.baseUrl + 'products', { params });
  }
}
