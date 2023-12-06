using ASNClub.DTOs.Product;
using ASNClub.Services.CategoryServices.Contracts;
using ASNClub.Services.ColorServices.Contracts;
using ASNClub.Services.ProductServices.Contracts;
using ASNClub.DTOs.Discount;
using ASNClub.Services.TypeServices.Contracts;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/product")]
    [EnableCors("AllowOrigin")]

    public class ProductController : Controller
    {
        private readonly IProductService productService;
        private readonly ICategoryService categoryService;
        private readonly IColorService colorService;
        private readonly ITypeService typeService;

        private readonly IWebHostEnvironment webHost;
        public ProductController(IProductService _productService,
            ICategoryService _categoryService,
            IColorService _colorService,
            ITypeService _typeService, 
            IWebHostEnvironment _webHost)
        {
            this.productService = _productService;
            this.categoryService = _categoryService;
            this.colorService = _colorService;
            this.typeService = _typeService;
            this.webHost = _webHost;
        }

        [HttpGet("Create")]
        public async Task<ProductFormDTO> CreateProduct()
        {
            ProductFormDTO productDTO = new ProductFormDTO();
            productDTO.Categories = await categoryService.AllCategoriesAsync();
            productDTO.Colors = await colorService.AllColorsAsync();
            productDTO.Types = await typeService.AllTypesAsync();
            productDTO.Discounts = await productService.AllDiscountsAsync();
            productDTO.Discount = new DiscountFormDTO();
            return productDTO;
        }
        [HttpPost("Create")]
        public async Task<IActionResult> CreateProduct(ProductFormDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            await productService.CreateProductAsync(productDTO);
            return StatusCode(201);
        }
        [HttpPost("Photos")]
        public async Task<IActionResult> UploadImgs(IFormFile file)//cannot get collections
        {

            if (file != null && file.Length > 0)
            {
                // Process each file and save it to the server
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }

                // Construct the URL for the newly uploaded image
                var imageUrl = Url.Content($"~/images/{fileName}");
                var response = new ImageUploadResponseDTO
                {
                    Url = imageUrl,
                };
                return Ok(response);
            }
            return BadRequest("File not provided or invalid.");

        }

        [HttpGet("Update")]
        public async Task<ProductFormDTO> UpdateProduct(int id)
        {
            var productDTO = await productService.GetProductForEditAsync(id);
            productDTO.Categories = await categoryService.AllCategoriesAsync();
            productDTO.Colors = await colorService.AllColorsAsync();
            productDTO.Types = await typeService.AllTypesAsync();
            productDTO.Discounts = await productService.AllDiscountsAsync();
            return productDTO;
        }
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateProduct(ProductFormDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            await productService.EditProductAsync(productDTO);
            return StatusCode(200);
        }

        [HttpGet("Delete")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            await productService.DeleteProductAsync(productId);
            return StatusCode(200);
        }
    }
}
