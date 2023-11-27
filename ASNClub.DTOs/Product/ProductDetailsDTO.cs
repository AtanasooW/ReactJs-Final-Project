using ASNClub.DTOs.Color;
using ASNClub.DTOs.Discount;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASNClub.DTOs.Product
{
    public class ProductDetailsDTO
    {
        public ProductDetailsDTO()
        {
            this.ImgUrls = new List<string>();
        }
        public int Id { get; set; }
        public string Make { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string Type { get; set; } = null!;
        public int TypeId { get; set; }
        public decimal Price { get; set; }
        public double Rating { get; set; } = 0.0;
        public DiscountFormDTO Discount { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Quantity { get; set; }
        public string Category { get; set; } = null!;
        public List<string> ImgUrls { get; set; }
        public string? Color { get; set; }
        public List<ColorProductIdDTO>? Colors { get; set; }
    }
}
