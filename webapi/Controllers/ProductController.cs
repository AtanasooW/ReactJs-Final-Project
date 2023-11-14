using ASNClub.DTOs.Product;
using ASNClub.Services.CategoryServices.Contracts;
using ASNClub.Services.ColorServices.Contracts;
using ASNClub.Services.ProductServices.Contracts;
using ASNClub.Services.TypeServices.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [Route("api/product")]
    [ApiController]
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
            return productDTO;
        }
        [HttpPost("Create")]
        public async Task<IActionResult> CreateProduct(ProductFormDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            productDTO.ImgUrls = await UploadImgs(productDTO.Imgs);
            await productService.CreateProductAsync(productDTO);
            return StatusCode(201);
        }
        private async Task<List<string>> UploadImgs(List<IFormFile> imgs)
        {
            List<string> urls = new List<string>();
            foreach (var img in imgs)
            {
                var saveimg = Path.Combine(webHost.WebRootPath, "Images", img.FileName);
                string imgEnding = Path.GetExtension(img.FileName);
                if (imgEnding == ".jpg" || imgEnding == ".png")
                {
                    using (var fileStream = new FileStream(saveimg, FileMode.Create))
                    {
                        await img.CopyToAsync(fileStream);
                    }
                    urls.Add(saveimg);
                }
                else
                {
                    throw new InvalidCastException("Invalid img type");
                }
            }
            return urls;
        }


        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            await productService.DeleteProductAsync(productId);
            return StatusCode(200);
        }


        [HttpGet("Update")]
        public async Task<ProductFormDTO> UpdateProduct(int productId)
        {
            var productDTO = await productService.GetProductForEditAsync(productId);
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
    }
}
