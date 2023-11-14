using ASNClub.ViewModels.Product.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using static ASNClub.Common.ApplicationConstants;

namespace ASNClub.DTOs.Product
{
    public class AllProductQueryModel
    {
        public AllProductQueryModel()
        {
            this.Makes = new HashSet<string>();
            this.Models = new HashSet<string>();
            this.Types = new HashSet<string>();
            this.Categories = new HashSet<string>();

            this.Products = new HashSet<AllProductDTO>();
            this.ProductsPerPage = DefaultEntitiesPerPage;
            this.CurrentPage = DefaultPage;
        }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public string? Type { get; set; }
        public string? Category { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
        [Display(Name = "Search by text")]
        public string? SearchString { get; set; }

        [Display(Name = "Sort Product By")]
        public ProductSorting ProductSorting { get; set; }

        public int CurrentPage { get; set; }

        [Display(Name = "Show Products On Page")]
        public int ProductsPerPage { get; set; }

        public int TotalProducts { get; set; }

        public IEnumerable<string> Makes { get; set; }
        public IEnumerable<string>? Models { get; set; }
        public IEnumerable<string> Types { get; set; }
        public IEnumerable<string> Categories { get; set; }

        public IEnumerable<AllProductDTO> Products { get; set; }
    }
}
