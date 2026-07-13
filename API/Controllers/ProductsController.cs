using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using API.RequestHelpers;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using API.DTOs;
using AutoMapper;


namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IUnitOfWork unit, IMapper mapper) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult> GetProducts([FromQuery] ProductSpecParams specParams)
    {
        var spec = new ProductSpecification(specParams);

        // 1. Fetch the raw data and total count
        var products = await unit.Repository<Product>().ListAsync(spec);
        var totalItems = await unit.Repository<Product>().CountAsync(spec);

        // 2. Map the list to your DTOs
        var data = mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductDto>>(products);

        // 3. Return the formatted pagination object
        return Ok(new Pagination<ProductDto>(specParams.PageIndex, specParams.PageSize, totalItems, data));
    }

    [HttpGet("{id:int}")] // api/products/3
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if (product == null) return NotFound();

        // 3. Use 'mapper' (without the underscore) to match the primary constructor injection
        return mapper.Map<Product, ProductDto>(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto dto)
    {
        var picturePath = "";

        // 1. Check if a file was actually uploaded
        if (dto.PictureUrl != null && dto.PictureUrl.Length > 0)
        {
            // 2. Generate a unique filename (e.g., to prevent "shirt.png" from overwriting another "shirt.png")
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.PictureUrl.FileName);

            // 3. Define the physical path on your server (ensure wwwroot/images/products exists)
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products", fileName);

            // 4. Copy the file to the server folder
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.PictureUrl.CopyToAsync(stream);
            }

            // 5. Create the relative URL path to save in the database
            picturePath = "images/products/" + fileName;
        }

        // 6. Now map everything to the product, including the new picture URL
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            PictureUrl = picturePath, // <-- Use the newly created path here
            Type = dto.Type,
            Brand = dto.Brand,
            QuantityInStock = dto.QuantityInStock,
            DiscountPercentage = dto.DiscountPercentage
        };

        unit.Repository<Product>().Add(product);

        if (await unit.Complete())
        {
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        return BadRequest("Problem creating product");
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, [FromForm] UpdateProductDto dto)
    {
        // 1. Get the existing product from the DB first
        var product = await unit.Repository<Product>().GetByIdAsync(id);
        if (product == null) return NotFound();

        // 2. Check if the user uploaded a NEW image
        if (dto.PictureUrl != null && dto.PictureUrl.Length > 0)
        {
            // Delete the OLD image from the server
            if (!string.IsNullOrEmpty(product.PictureUrl))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.PictureUrl);
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            // Save the NEW image
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.PictureUrl.FileName);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.PictureUrl.CopyToAsync(stream);
            }

            // Update the URL to the new picture
            product.PictureUrl = "images/products/" + fileName;
        }

        // 3. Update all the other text properties
        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.Type = dto.Type;
        product.Brand = dto.Brand;
        product.QuantityInStock = dto.QuantityInStock;
        product.DiscountPercentage = dto.DiscountPercentage;

        // 4. Save changes
        unit.Repository<Product>().Update(product);

        if (await unit.Complete())
        {
            return NoContent();
        }
        return BadRequest("Problem updating product");
    }


    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);
        if (product == null) return NotFound();

        // 1. Delete the physical image file from the server
        if (!string.IsNullOrEmpty(product.PictureUrl))
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.PictureUrl);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        // 2. Remove the product from the database
        unit.Repository<Product>().Remove(product);

        if (await unit.Complete())
        {
            return NoContent();
        }
        return BadRequest("Problem deleting product");
    }

    [HttpGet("brands")]

    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecification();
        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }

    [HttpGet("types")]

    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();
        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }


    private bool ProductExists(int id)
    {
        return unit.Repository<Product>().Exists(id);
    }

}
