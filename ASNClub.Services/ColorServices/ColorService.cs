using ASNClub.Data;
using ASNClub.DTOs.Color;
using ASNClub.Services.ColorServices.Contracts;
using Microsoft.EntityFrameworkCore;

namespace ASNClub.Services.ColorServices
{
    public class ColorService : IColorService
    {
        private readonly ASNClubDbContext dbContext;
        public ColorService(ASNClubDbContext _dbContext)
        {
            this.dbContext = _dbContext;
        }
        public async Task<IEnumerable<ColorFormDTO>> AllColorsAsync()
        {
            IEnumerable<ColorFormDTO> colors = await dbContext.Colors
                .AsNoTracking()
                .Select(x => new ColorFormDTO
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToListAsync();
            return colors;
        }
    }
}
