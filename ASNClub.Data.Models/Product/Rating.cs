using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASNClub.Data.Models.Product
{
    public class Rating
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public double RatingValue { get; set; }

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;

        [Required]
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        [Required]
        [ForeignKey("Comment")]
        public Guid CommentId { get; set; }
        public Comment Comment { get; set; } = null!;

        [Required]
        public DateTime RatedOn { get; set; }
        public ICollection<Like> Likes { get; set; } = new HashSet<Like>();


    }
}
