using System.ComponentModel.DataAnnotations;


namespace API.DTOs;

public class UpdateProductDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    // IMPORTANT: No [Required] attribute here! 
    // This allows admins to update text without uploading a new image.
    public IFormFile? PictureUrl { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string Brand { get; set; } = string.Empty;

    [Range(0, int.MaxValue, ErrorMessage = "Quantity in stock must be at least 1")]
    public int QuantityInStock { get; set; }

    [Range(0, 100, ErrorMessage = "Discount must be between 0 and 100")]
    public int DiscountPercentage { get; set; } = 0;
}