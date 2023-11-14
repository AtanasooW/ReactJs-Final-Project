using ASNClub.DTOs.Type;

namespace ASNClub.Services.TypeServices.Contracts
{
    public interface ITypeService
    {
        public Task<IEnumerable<TypeFormDTO>> AllTypesAsync();
        public Task<IEnumerable<string>> AllTypeNamesAsync();
    }
}
