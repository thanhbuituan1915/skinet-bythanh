using Core.Entities;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using API.DTOs;
namespace API.Helpers
{
    public class ProductUrlResolver : IValueResolver<Product, ProductDto, string>
    {
        private readonly IConfiguration _config;

        public ProductUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Product source, ProductDto destination, string destMember, ResolutionContext context)
        {
            // If the database has a picture URL, prepend the ApiUrl from appsettings
            if (!string.IsNullOrEmpty(source.PictureUrl))
            {
                // If it's already an absolute URL (like an external image), just return it
                if (source.PictureUrl.StartsWith("http"))
                {
                    return source.PictureUrl;
                }

                return _config["ApiUrl"] + source.PictureUrl;
            }

            return null; // Return null if no image is found
        }
    }
}
