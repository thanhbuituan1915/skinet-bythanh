using API.DTOs;
using AutoMapper;
using Core.Entities;


namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // This tells AutoMapper: "When translating a Product to a ProductDto, 
            // use the ProductUrlResolver for the PictureUrl property."
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom<ProductUrlResolver>());
        }
    }
}