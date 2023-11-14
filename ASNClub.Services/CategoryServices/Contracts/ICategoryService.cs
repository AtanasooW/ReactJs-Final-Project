using ASNClub.DTOs.Category;

namespace ASNClub.Services.CategoryServices.Contracts
{
    public interface ICategoryService
    {
        public Task<IEnumerable<CategoryFormDTO>> AllCategoriesAsync();
        public Task<IEnumerable<string>> AllCategoryNamesAsync();
    }
}
