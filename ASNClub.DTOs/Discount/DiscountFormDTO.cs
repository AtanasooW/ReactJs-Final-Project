using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASNClub.DTOs.Discount
{
    public class DiscountFormDTO
    {
        public bool IsDiscount { get; set; } = false;
        public string Name { get; set; } = null!;

        public double? DiscountRate { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
