using ASNClub.DTOs.Product;
using ASNClub.Services.CategoryServices;
using ASNClub.Services.CategoryServices.Contracts;
using ASNClub.Services.ColorServices.Contracts;
using ASNClub.Services.ProductServices;
using ASNClub.Services.ProductServices.Contracts;
using ASNClub.Services.TypeServices;
using ASNClub.Services.TypeServices.Contracts;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/Shop")]
    [EnableCors("AllowOrigin")]
    public class ShopController : Controller
    {
        private readonly IProductService productService;
        private readonly ICategoryService categoryService;
        private readonly IColorService colorService;
        private readonly ITypeService typeService;
        public ShopController(IProductService _productService,
            ICategoryService _categoryService,
            IColorService _colorService,
            ITypeService _typeService)
        {
            this.productService = _productService;
            this.categoryService = _categoryService;
            this.colorService = _colorService;
            this.typeService = _typeService;
        }
        [HttpGet("All")]
        public async Task<AllProductQueryModel> GetAllProducts(string? make,
            string? model,
            string? type,
            string? category,
            double? minPrice,
            double? maxPrice,
            int productSorting,
            int productsPerPage)
        {
            AllProductQueryModel queryModel = new AllProductQueryModel()
            {
                Make = make,
                Model = model,
                Type = type,
                Category = category,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                ProductSorting = (ASNClub.ViewModels.Product.Enums.ProductSorting)productSorting,
                ProductsPerPage = productsPerPage
            };
            AllProductsSortedDTO serviceModel = await productService.GetAllProductsAsync(queryModel);
            queryModel.Products = serviceModel.Products;
            queryModel.TotalProducts = serviceModel.TotalProducts;
            queryModel.Categories = await categoryService.AllCategoryNamesAsync();
            queryModel.Types = await typeService.AllTypeNamesAsync();
            queryModel.Makes = await productService.AllMakeNamesAsync();
            if (queryModel.Make != null)
            {
                queryModel.Models = await productService.AllModelNamesAsync(queryModel.Make);
            }
            return queryModel;
        }
    }
}
