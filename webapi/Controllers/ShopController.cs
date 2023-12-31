﻿using ASNClub.DTOs.Product;
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
        public async Task<IActionResult> GetAllProducts(string? make,
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
            return Ok(queryModel);
        }
        [HttpGet("Details")]
        public async Task<IActionResult> Details(int id)
        {
            var model = await productService.GetProductDetailsByIdAsync(id);
            if (model == null)
            {
                return BadRequest("Product not found");
            }
            return Ok(model);
        }
        [HttpGet("Rating")]
        public async Task<IActionResult> SetRating(int id, int ratingValue, string userId) // guid UserId
        {
            try
            {
                await productService.AddRatingAsync(id, ratingValue, userId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Error ocures while rating " + e.Message);
            }
        }
        [HttpGet("CheckoutProduct")]
        public async Task<IActionResult> CheckoutProduct(int id)
        {
            var product = await productService.GetProductForCheckout(id);
            if (product != null)
            {
                return Ok(product);
            }
            else
            {
                return BadRequest("Error ocures");
            }
        }
        [HttpPost("PlaceOrder")]
        public async Task<IActionResult> CheckoutWitoutProfile([FromBody]OrderProductDTO model)
        {
            try
            {
                await productService.PlaceOrderAsync(model);
                return Ok();
            }
            catch (Exception e)
            {

                return BadRequest("Error ocures while ordering: " + e.Message);
            }
        }
    }
}
