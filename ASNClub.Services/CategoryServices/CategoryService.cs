using ASNClub.Data;
using ASNClub.DTOs.Category;
using ASNClub.Services.CategoryServices.Contracts;
using Microsoft.EntityFrameworkCore;

namespace ASNClub.Services.CategoryServices
{
    public class CategoryService : ICategoryService
    {
        private readonly ASNClubDbContext dbContext;
        public CategoryService(ASNClubDbContext _dbContext)
        {
            this.dbContext = _dbContext;
        }
        public async Task<IEnumerable<CategoryFormDTO>> AllCategoriesAsync()
        {
            IEnumerable<CategoryFormDTO> categories = await dbContext.Categories
                .AsNoTracking()
                .Select(x => new CategoryFormDTO
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToListAsync();
            return categories;
        }

        public async Task<IEnumerable<string>> AllCategoryNamesAsync()
        {
            IEnumerable<string> categories = await dbContext.Categories
             .AsNoTracking()
             .Select(x => x.Name)
             .ToListAsync();
            return categories;
        }
    }
}
