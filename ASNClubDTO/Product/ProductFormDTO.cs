using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ASNClub.DTOs.Discount;
using ASNClub.DTOs.Category;
using ASNClub.DTOs.Color;
using ASNClub.DTOs.Type;
using Microsoft.AspNetCore.Http;

namespace ASNClub.DTOs.Product
{
    public class ProductFormDTO
    {
        public ProductFormDTO()
        {
            this.Categories = new HashSet<CategoryFormDTO>();
            this.Colors = new HashSet<ColorFormDTO>();
            this.Types = new HashSet<TypeFormDTO>();
            this.ImgUrls = new List<string>();
            this.Imgs = new List<IFormFile>();
        }
        public int? Id { get; set; }
        [Required]
        public string Make { get; set; } = null!;
        [Required]
        public string Model { get; set; } = null!;

        [Required]
        [Display(Name = "Type")]
        public int TypeId { get; set; }

        public IEnumerable<TypeFormDTO> Types { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Display(Name = "Discount")]
        public DiscountFormDTO Discount { get; set; }
        //This is for dropdown menu for the names of the discounts
        [Display(Name = "Discount")]
        public int? DiscountId { get; set; }
        public IEnumerable<DiscountViewDTO> Discounts { get; set; }


        [Required]
        public string Description { get; set; } = null!;
        [Required]
        public int Quantity { get; set; }

        [Required]
        [Display(Name = "Category")]
        public int CategoryId { get; set; }

        public IEnumerable<CategoryFormDTO> Categories { get; set; }
        [Required]
        public List<IFormFile> Imgs { get; set; } = null!;
        public List<string> ImgUrls { get; set; }

        [Display(Name = "Color")]
        public int? ColorId { get; set; }

        public IEnumerable<ColorFormDTO> Colors { get; set; }
    }
}
