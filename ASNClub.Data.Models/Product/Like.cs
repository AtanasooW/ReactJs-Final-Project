using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASNClub.Data.Models.Product
{
    public class Like
    {

        [Required]
        [ForeignKey("Rating")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid RatingId { get; set; }
        public Rating Rating { get; set; } = null!;

        [Required]
        [ForeignKey("UserLike")]
        public Guid UserIdLike { get; set; }
        public ApplicationUser UserLike { get; set; } = null!;

    }
}
