using ASNClub.Data.Models.AddressModels;
using ASNClub.Data.Models.Orders;
using ASNClub.Data.Models.Product;
using ASNClub.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Reflection.Emit;

namespace ASNClub.Data;

public class ASNClubDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ASNClubDbContext(DbContextOptions<ASNClubDbContext> options)
        : base(options)
    {
    }
    //Address
    public DbSet<Address> Addresses { get; set; } = null!;
    public DbSet<UserAddress> UsersAddresses { get; set; } = null!;
    public DbSet<Country> Countries { get; set; } = null!;

    //Product
    public DbSet<Models.Product.Color> Colors { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Discount> Discounts { get; set; } = null!;
    public DbSet<ImgUrl> ImgUrls { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Rating> Ratings { get; set; } = null!;
    public DbSet<ProductImgUrl> ProductsImgUrls { get; set; } = null!;
    public DbSet<Models.Product.Type> Types { get; set; } = null!;

    //Order
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderStatus> OrdersStatuses { get; set; }
    public DbSet<OrderItem> OrdersItems { get; set; }
    public DbSet<Like> Likes { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Product>(x => x.Property(x => x.ColorId).IsRequired(false));
        builder.Entity<Order>(x => x.Property(x => x.UserId).IsRequired(false));

        builder.Entity<ProductImgUrl>(x => x.HasKey(x => new { x.ProductId, x.ImgUrlId }));
        builder.Entity<UserAddress>(x => x.HasKey(x => new { x.AddressId, x.UserId }));
        builder.Entity<Like>(x => x.HasKey(x => new { x.RatingId, x.UserIdLike }));

        Assembly configAssembly = Assembly.GetAssembly(typeof(ASNClubDbContext)) ??
                                  Assembly.GetExecutingAssembly();
        builder.ApplyConfigurationsFromAssembly(configAssembly);
        builder.Entity<Like>()
               .HasOne(l => l.Rating)
               .WithMany(r => r.Likes)
               .HasForeignKey(l => l.RatingId)
               .OnDelete(DeleteBehavior.NoAction); // Enable cascade delete for Like entities related to Rating

        base.OnModelCreating(builder);
        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);
    }
}
