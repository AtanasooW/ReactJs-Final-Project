﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace ASNClub.Data.Models.Product
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Make { get; set; } = null!;
        [Required]
        public string Model { get; set; } = null!;

        [Required]
        [ForeignKey("Type")]
        public int TypeId { get; set; }
        public Type Type { get; set; } = null!; //Models.Type

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        [ForeignKey("Discount")]
        public int DiscountId { get; set; }
        public Discount Discount { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        [Required]
        public int Quantity { get; set; }

        [ForeignKey("Color")]
        public int? ColorId { get; set; }
        public Color Color { get; set; } = null!;//Models.Color

        [Required]
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<Rating> Ratings { get; set; } = new HashSet<Rating>();
        public ICollection<ProductImgUrl> ImgUrls { get; set; } = new HashSet<ProductImgUrl>();

    }
}