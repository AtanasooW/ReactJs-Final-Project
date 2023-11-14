using ASNClub.Data;
using ASNClub.DTOs.Type;
using ASNClub.Services.TypeServices.Contracts;
using Microsoft.EntityFrameworkCore;

namespace ASNClub.Services.TypeServices
{
    public class TypeService : ITypeService
    {
        private readonly ASNClubDbContext dbContext;
        public TypeService(ASNClubDbContext _dbContext)
        {
            this.dbContext = _dbContext;
        }
        public async Task<IEnumerable<TypeFormDTO>> AllTypesAsync()
        {
            IEnumerable<TypeFormDTO> types = await dbContext.Types
               .AsNoTracking()
               .Select(x => new TypeFormDTO
               {
                   Id = x.Id,
                   Name = x.Name
               }).ToListAsync();
            return types;
        }
        public async Task<IEnumerable<string>> AllTypeNamesAsync()
        {
            IEnumerable<string> types = await dbContext.Types
                .AsNoTracking()
                .Select(x => x.Name)
                .ToListAsync();
            return types;
        }
    }
}
