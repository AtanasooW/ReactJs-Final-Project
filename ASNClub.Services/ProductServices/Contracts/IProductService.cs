using ASNClub.Data.Models.Product;
using ASNClub.DTOs.Discount;
using ASNClub.DTOs.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASNClub.Services.ProductServices.Contracts
{
    public interface IProductService
    {
        public Task<AllProductsSortedDTO> GetAllProductsAsync(AllProductQueryModel queryModel);
        public Task<IEnumerable<DiscountViewDTO>> AllDiscountsAsync();
        public Task CreateProductAsync(ProductFormDTO formModel);
        public Task DeleteProductAsync(int productId);
        public Task EditProductAsync(ProductFormDTO productDTO);
        public Task<ProductDetailsDTO?> GetProductDetailsByIdAsync(int productId);
        public Task<AllProductDTO> GetProductForCheckout(int id);
        public Task PlaceOrderAsync(OrderProductDTO model);

        public Task AddRatingAsync(int id, int ratingValue, string userId);

        public Task<IEnumerable<string>> AllMakeNamesAsync();
        public Task<IEnumerable<string>> AllModelNamesAsync(string make);
        public Task<ProductFormDTO> GetProductForEditAsync(int productId);
        public Task<Product> GetProductOfTypeProductByIdAsync(int id);
       
    }
}
