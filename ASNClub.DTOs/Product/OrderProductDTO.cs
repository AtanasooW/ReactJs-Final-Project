using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ASNClub.DTOs.Product
{
    public class OrderProductDTO 
    {
        public string City { get; set; } = null!;
        public string Street1 { get; set; } = null!;
        public string Street2 { get; set; } = null!;
        public string StreetNumber { get; set; } = null!;
        public string PostalCode { get; set; } = null!;
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string phoneNumber { get; set; } = null!;

    }
}
