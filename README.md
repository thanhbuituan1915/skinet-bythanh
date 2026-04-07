# Kiến trúc dự án .NET Web API - Skinet

Tài liệu này mô tả kiến trúc và luồng xử lý dữ liệu của ứng dụng .NET Web API, được thiết kế theo nguyên tắc Clean Architecture. Kiến trúc này chia dự án thành các lớp (projects) riêng biệt, mỗi lớp có một trách nhiệm cụ thể, giúp mã nguồn trở nên rõ ràng, dễ bảo trì và mở rộng.

## 1. Tổng quan cấu trúc dự án

Dự án được chia thành 3 lớp chính:

- **`Core`**: Đây là lớp trung tâm của ứng dụng, chứa các business logic cốt lõi. Nó không phụ thuộc vào bất kỳ lớp nào khác.
  - **`Entities`**: Định nghĩa các đối tượng nghiệp vụ (ví dụ: `Product`, `BaseEntity`).
  - **`Interfaces`**: Định nghĩa các "hợp đồng" (contracts) cho repository, quy định các phương thức truy xuất dữ liệu mà lớp `Infrastructure` phải tuân theo (ví dụ: `IProductRepository`).

- **`Infrastructure`**: Lớp này chịu trách nhiệm về các vấn đề kỹ thuật bên ngoài, chủ yếu là truy cập dữ liệu.
  - **`Data`**: Chứa các triển khai cụ thể của repository (ví dụ: `ProductRepository`) và `DbContext` của Entity Framework Core (`StoreContext`). Lớp này giao tiếp trực tiếp với cơ sở dữ liệu.
  - **`Config`**: Cấu hình cho Entity Framework, ví dụ như cách các `Entity` được ánh xạ vào bảng trong cơ sở dữ liệu.

- **`API`**: Lớp này là điểm vào (entry point) của ứng dụng, chịu trách nhiệm xử lý các HTTP request và response.
  - **`Controllers`**: Tiếp nhận request từ client, gọi đến các service hoặc repository tương ứng để xử lý và trả về response.
  - **`Program.cs`**: Cấu hình và khởi chạy ứng dụng, bao gồm cả việc đăng ký các dịch vụ cho Dependency Injection.

## 2. Luồng xử lý dữ liệu (Request/Response Flow)

Để hiểu rõ cách các thành phần tương tác, chúng ta sẽ phân tích luồng xử lý của một yêu cầu lấy danh sách sản phẩm: `GET /api/products`.

```mermaid
sequenceDiagram
    participant Client
    participant ProductsController (API)
    participant IProductRepository (Core)
    participant ProductRepository (Infrastructure)
    participant StoreContext (Infrastructure)
    participant Database

    Client->>+ProductsController (API): GET /api/products
    Note over ProductsController (API): Controller nhận request.
    ProductsController (API)->>+IProductRepository (Core): Gọi hàm GetProductsAsync()
    Note over IProductRepository (Core): Controller chỉ biết đến Interface, không biết đến implementation cụ thể.
    IProductRepository (Core)-->>-ProductRepository (Infrastructure): (DI giải quyết)
    ProductRepository (Infrastructure)->>+StoreContext (Infrastructure): Sử dụng _context.Products.ToListAsync()
    Note over StoreContext (Infrastructure): DbContext dịch yêu cầu LINQ thành câu lệnh SQL.
    StoreContext (Infrastructure)->>+Database: Thực thi câu lệnh SQL (SELECT * FROM Products)
    Database-->>-StoreContext (Infrastructure): Trả về dữ liệu thô
    StoreContext (Infrastructure)-->>-ProductRepository (Infrastructure): Ánh xạ dữ liệu thành List<Product>
    ProductRepository (Infrastructure)-->>-ProductsController (API): Trả về List<Product>
    ProductsController (API)-->>-Client: Trả về HTTP 200 OK cùng danh sách sản phẩm (JSON)
```

**Diễn giải chi tiết các bước:**

1.  **Client gửi Request**: Người dùng hoặc một ứng dụng khác gửi một `GET` request đến endpoint `/api/products`.
2.  **Controller tiếp nhận**: `ProductsController` trong dự án `API` tiếp nhận request này. Phương thức `GetProducts()` được thực thi.
3.  **Controller gọi Interface**: Controller không tạo ra một đối tượng repository trực tiếp. Thay vào đó, nó yêu cầu một instance của `IProductRepository` (được inject vào qua constructor). Sau đó, nó gọi phương thức `GetProductsAsync()` từ interface này.
4.  **Repository thực thi**: Lớp `ProductRepository` trong dự án `Infrastructure` (là lớp triển khai `IProductRepository`) sẽ thực thi phương thức. Nó sử dụng `StoreContext` (cũng được inject vào) để truy vấn cơ sở dữ liệu.
5.  **DbContext và Database**: `StoreContext` (một lớp kế thừa từ `DbContext` của EF Core) nhận yêu cầu truy vấn LINQ (`_context.Products.ToListAsync()`), dịch nó thành câu lệnh SQL tương ứng và gửi đến cơ sở dữ liệu.
6.  **Dữ liệu trả về**: Cơ sở dữ liệu trả kết quả về cho `StoreContext`. EF Core sẽ tự động ánh xạ (map) dữ liệu từ các hàng trong bảng thành một danh sách các đối tượng `Product` (List<Product>).
7.  **Response cho Client**: Danh sách sản phẩm được trả về qua các lớp: `ProductRepository` -> `ProductsController`. Controller sau đó đóng gói danh sách này thành một `OkObjectResult` (HTTP 200 OK) và serialize nó thành định dạng JSON để gửi về cho client.

## 3. Vai trò của Dependency Injection (DI)

Dependency Injection là cơ chế "kết dính" các thành phần lại với nhau một cách linh hoạt. Thay vì một lớp phải tự tạo ra các đối tượng phụ thuộc của nó (ví dụ: `new ProductRepository()`), DI Container sẽ làm việc đó.

Trong file `Program.cs`, bạn sẽ thấy các dòng cấu hình tương tự như sau:

```csharp
// builder.Services.AddScoped<IProductRepository, ProductRepository>();
```

**Dòng code này có ý nghĩa:** "Này DI Container, mỗi khi có một lớp nào đó (ví dụ như `ProductsController`) yêu cầu một `IProductRepository` trong constructor của nó, hãy cung cấp cho nó một instance của `ProductRepository`."

**Lợi ích:**

- **Loose Coupling (Liên kết lỏng lẻo)**: `ProductsController` không còn bị "ràng buộc cứng" với `ProductRepository`. Nó chỉ biết về `IProductRepository`. Điều này cho phép bạn dễ dàng thay thế `ProductRepository` bằng một implementation khác (ví dụ: một repository giả để test) mà không cần sửa đổi code của `ProductsController`.
- **Tăng khả năng Test**: Khi viết unit test cho `ProductsController`, bạn có thể dễ dàng "mock" (giả lập) `IProductRepository` để kiểm tra logic của controller một cách độc lập mà không cần kết nối đến cơ sở dữ liệu thật.
- **Quản lý vòng đời đối tượng**: DI Container quản lý việc khi nào một đối tượng được tạo ra và khi nào nó bị hủy, giúp tối ưu hóa việc sử dụng tài nguyên.
