namespace ASNClub.DTOs.Product
{
    public class AllProductsSortedDTO
    {
        public AllProductsSortedDTO()
        {
            this.Products = new HashSet<AllProductDTO>();
        }
        public int TotalProducts { get; set; }
        public IEnumerable<AllProductDTO> Products { get; set; }
    }
}