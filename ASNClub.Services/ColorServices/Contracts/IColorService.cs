using ASNClub.DTOs.Color;

namespace ASNClub.Services.ColorServices.Contracts
{
    public interface IColorService
    {
        public Task<IEnumerable<ColorFormDTO>> AllColorsAsync();
    }
}
