using ASNClub.Data;
using ASNClub.Data.Models.Product;
using ASNClub.DTOs.Color;
using ASNClub.DTOs.Discount;
using ASNClub.DTOs.Product;
using ASNClub.Services.ProductServices.Contracts;
using ASNClub.ViewModels.Product.Enums;
using Microsoft.EntityFrameworkCore;

namespace ASNClub.Services.ProductServices
{
    public class ProductService : IProductService
    {
        private readonly ASNClubDbContext dbContext;
        public ProductService(ASNClubDbContext _dbContext)
        {
            this.dbContext = _dbContext;
        }
        public async Task<AllProductsSortedDTO> GetAllProductsAsync(AllProductQueryModel queryModel)
        {
            IQueryable<Product> products = dbContext.Products.AsQueryable().AsNoTracking();

            //TO DO The logic for model drop down and make
            if (!string.IsNullOrWhiteSpace(queryModel.Category))
            {
                products = products.Where(x => x.Category.Name == queryModel.Category);
            }
            if (!string.IsNullOrWhiteSpace(queryModel.Type))
            {
                products = products.Where(x => x.Type.Name == queryModel.Type);
            }
            if (!string.IsNullOrWhiteSpace((queryModel.MinPrice).ToString()) )
            {
                products = products.Where(x => x.Price >= (decimal)queryModel.MinPrice);
            }
            if (!string.IsNullOrWhiteSpace((queryModel.MaxPrice).ToString()))
            {
                products = products.Where(x => x.Price <= (decimal)queryModel.MaxPrice);
            }
            if (!string.IsNullOrWhiteSpace(queryModel.Make))
            {
                products = products.Where(x => x.Make == queryModel.Make);
            }
            if (string.IsNullOrWhiteSpace(queryModel.Make) && !string.IsNullOrWhiteSpace(queryModel.Model))
            {
                queryModel.Model = null;
            }
            if (!string.IsNullOrWhiteSpace(queryModel.Model))
            {
                products = products.Where(x => x.Model == queryModel.Model);
            }
            if (!string.IsNullOrWhiteSpace(queryModel.SearchString)) //TO DO Search bar is worikng with only one word fix that 
            {
                string[] searchStrings = queryModel.SearchString.Split(" ", StringSplitOptions.RemoveEmptyEntries);
                string wildCardForMake = $"%{searchStrings[0].ToLower()}%";
                string wildCardForModel = $"%{searchStrings[1].ToLower()}%";

                products = products
                    .Where(h => EF.Functions.Like(h.Make.ToLower(), wildCardForMake) &&
                                EF.Functions.Like(h.Model.ToLower(), wildCardForModel));
            }
            products = queryModel.ProductSorting switch
            {
                ProductSorting.PriceAscending => products.OrderBy(x => x.Price),
                ProductSorting.PriceDescending => products.OrderByDescending(x => x.Price),
                ProductSorting.RatingAscending => products.OrderBy(x => x.Ratings.Average(x => x.RatingValue)),
                ProductSorting.RatingDescending => products.OrderByDescending(x => x.Ratings.Average(x => x.RatingValue)),
                ProductSorting.Onsale => products.Where(x => x.Discount.IsDiscount)
            };

            IEnumerable<AllProductDTO> allProducts = await products
                .AsNoTracking()
                .Skip((queryModel.CurrentPage - 1) * queryModel.ProductsPerPage)
                .Take(queryModel.ProductsPerPage)
                .Select(p => new AllProductDTO
                {
                    Id = p.Id.ToString(),
                    Make = p.Make,
                    Model = p.Model,
                    Price = p.Price,
                    ImgUrl = p.ImgUrls.FirstOrDefault(x => x.ProductId == p.Id).ImgUrl.Url,
                    Type = p.Type.Name,
                    Color = p.Color.Name,
                    IsDiscount = p.Discount.IsDiscount,
                    DiscountRate = p.Discount.DiscountRate,
                    Rating = p.Ratings.Count() >= 1 ? p.Ratings.Average(x => x.RatingValue) : 0

                }).ToListAsync();
            AllProductsSortedDTO sortedModel = new AllProductsSortedDTO()
            {
                Products = allProducts,
                TotalProducts = products.Count()
            };
            return sortedModel;
        }
        public async Task CreateProductAsync(ProductFormDTO formModel)
        {
            Product product = new Product()
            {
                Make = formModel.Make,
                Model = formModel.Model,
                Price = formModel.Price,
                Description = formModel.Description,
                TypeId = formModel.TypeId,
                Quantity = formModel.Quantity,
                ColorId = formModel.ColorId == 0 || formModel.ColorId == 1 ? null : formModel.ColorId,// TO DO: do the logic to set null auto not id=1
                CategoryId = formModel.CategoryId
            };
            //Create discount logic 
            Discount discount = new Discount();
            discount.IsDiscount = formModel.Discount.IsDiscount;

            if (formModel.Discount.IsDiscount)
            {
                //if there is a discount given by name
                if (formModel.DiscountId != null)
                {
                    Discount? customDiscount = await dbContext.Discounts.Where(x => x.Id == formModel.DiscountId).FirstOrDefaultAsync();
                    if (customDiscount == null)
                    {
                        throw new InvalidOperationException("The given discount by name doesnt exist");
                    }

                    discount.Name = customDiscount.Name;
                    discount.DiscountRate = customDiscount.DiscountRate;
                    discount.StartDate = customDiscount.StartDate;
                    discount.EndDate = customDiscount.EndDate;
                }
                else
                {//if discount is entered manually
                    discount.Name = formModel.Discount.Name;
                    discount.DiscountRate = formModel.Discount.DiscountRate;
                    discount.StartDate = formModel.Discount.StartDate;
                    discount.EndDate = formModel.Discount.EndDate;
                }
            }
            await dbContext.Discounts.AddAsync(discount);
            await dbContext.SaveChangesAsync();

            product.DiscountId = discount.Id;
            await dbContext.Products.AddAsync(product);

            ICollection<ImgUrl> images = new HashSet<ImgUrl>();
            foreach (var item in formModel.ImgUrls)
            {
                ImgUrl imgUrl = new ImgUrl()
                {
                    Url = item
                };
                images.Add(imgUrl);
            }
            await dbContext.ImgUrls.AddRangeAsync(images);
            await dbContext.SaveChangesAsync();
            foreach (var item in images)
            {
                ProductImgUrl productImg = new ProductImgUrl()
                {
                    ProductId = product.Id,
                    ImgUrlId = item.Id
                };
                product.ImgUrls.Add(productImg);

            }
            await dbContext.ProductsImgUrls.AddRangeAsync(product.ImgUrls);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteProductAsync(int productId)
        {
            Product? product = await GetProductOfTypeProductByIdAsync((int)productId);
            if (product == null)
            {
                throw new InvalidOperationException("The given product id is not valid");
            }
            dbContext.Discounts.Remove(await dbContext.Discounts.Where(x => x.Id == product.DiscountId).FirstAsync());
            dbContext.ImgUrls.RemoveRange(product.ImgUrls.Select(x => x.ImgUrl));
            dbContext.ProductsImgUrls.RemoveRange(product.ImgUrls);
            foreach (var rating in product.Ratings)
            {
                dbContext.Likes.RemoveRange(rating.Likes);
            }
            dbContext.Comments.RemoveRange(product.Ratings.Select(x => x.Comment));
            dbContext.Ratings.RemoveRange(product.Ratings);
            dbContext.Products.Remove(product);
            await dbContext.SaveChangesAsync();
        }

        public async Task<ProductFormDTO?> GetProductForEditAsync(int productId)
        {
            var product = await GetProductOfTypeProductByIdAsync((int)productId);
            if (product == null)
            {
                throw new InvalidOperationException("Invalid product");
            }
            ProductFormDTO productDTO = new ProductFormDTO
            {
                Id = product.Id,
                Make = product.Make,
                Model = product.Model,
                Price = product.Price,
                Quantity = product.Quantity,
                CategoryId = product.CategoryId,
                TypeId = product.TypeId,
                ColorId = product.ColorId,
                Description = product.Description,
                Discount = new DiscountFormDTO
                {
                    Name = product.Discount.Name,
                    IsDiscount = product.Discount.IsDiscount,
                    DiscountRate = product.Discount.DiscountRate,
                    StartDate = product.Discount.StartDate,
                    EndDate = product.Discount.EndDate
                },
                ImgUrls = await dbContext.ProductsImgUrls.Where(x => x.ProductId == product.Id).Select(x => x.ImgUrl.Url).ToListAsync()
            };
            return productDTO;
        }
        public async Task EditProductAsync(ProductFormDTO productDTO)
        {
            var product = await GetProductOfTypeProductByIdAsync((int)productDTO.Id);
            if (product == null)
            {
                throw new InvalidOperationException("Invalid product");
            }

            if (productDTO.Discount.IsDiscount)
            {
                product.Discount.Name = productDTO.Discount.Name;
                product.Discount.IsDiscount = productDTO.Discount.IsDiscount;
                product.Discount.DiscountRate = productDTO.Discount.DiscountRate;
                product.Discount.StartDate = productDTO.Discount.StartDate;
                product.Discount.EndDate = productDTO.Discount.EndDate;
            }
            else
            {
                product.Discount.Name = String.Empty;
                product.Discount.DiscountRate = null;
                product.Discount.StartDate = null;
                product.Discount.EndDate = null;
            }

            product.Make = productDTO.Make;
            product.Model = productDTO.Model;
            product.Price = productDTO.Price;
            product.Description = productDTO.Description;
            product.Quantity = productDTO.Quantity;
            product.TypeId = productDTO.TypeId;
            product.CategoryId = productDTO.CategoryId;
            product.ColorId = productDTO.ColorId;

            var oldUrls = await dbContext.ProductsImgUrls.Where(x=> x.ProductId == product.Id).Include(x=> x.ImgUrl).Select(x => x.ImgUrl.Url).ToListAsync();
            //Adding new images
            foreach (var newUrl in productDTO.ImgUrls)
            {
                if (!oldUrls.Contains(newUrl))
                {
                    //Add the new image url to the database and get the id for the next step (add the mapping table save)
                    ImgUrl newImageUrl = new ImgUrl
                    {
                        Url = newUrl,
                    };
                    await dbContext.ImgUrls.AddAsync(newImageUrl);
                    await dbContext.SaveChangesAsync();
                    //Adding the map save to the database and the object
                    ProductImgUrl newProductImgUrl = new ProductImgUrl
                    {
                        ProductId = product.Id,
                        ImgUrlId = newImageUrl.Id,
                    };
                    product.ImgUrls.Add(newProductImgUrl);
                    await dbContext.ProductsImgUrls.AddAsync(newProductImgUrl);
                    await dbContext.SaveChangesAsync();
                }
            }
            //Remove removed images
            foreach (var oldUrl in oldUrls)
            {
                if (!productDTO.ImgUrls.Contains(oldUrl))
                {
                    var removedProductImgUrl = await dbContext.ProductsImgUrls.Where(x => x.ImgUrl.Url == oldUrl).FirstAsync();
                    var removedImgUrl = await dbContext.ImgUrls.Where(x => x.Url == oldUrl).FirstAsync();

                    product.ImgUrls.Remove(removedProductImgUrl);
                    dbContext.ProductsImgUrls.Remove(removedProductImgUrl);
                    dbContext.ImgUrls.Remove(removedImgUrl);
                    await dbContext.SaveChangesAsync();
                }
            }
            await dbContext.SaveChangesAsync();
        }

        public async Task<Product?> GetProductOfTypeProductByIdAsync(int id)
        {
            return await dbContext.Products.Include(x => x.Discount).Where(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<ProductDetailsDTO?> GetProductDetailsByIdAsync(int id)
        {
            var product = await dbContext.Products
                .Where(x => x.Id == id)
                .Include(x => x.Ratings)// Include the Ratings collection
                .Include(x => x.Discount)
                .Select(x => new ProductDetailsDTO
                {
                    Id = x.Id,
                    Make = x.Make,
                    Model = x.Model,
                    Price = x.Price,
                    Description = x.Description,
                    Category = x.Category.Name,
                    Type = x.Type.Name,
                    TypeId = x.TypeId,
                    Rating = x.Ratings.Count() == 0 ? 0.0 : x.Ratings.Average(r => r.RatingValue),
                    ImgUrls = x.ImgUrls.Select(i => i.ImgUrl.Url).ToList(), // Convert to List<string>
                    Quantity = x.Quantity,
                    Color = x.Color.Name, // Use null-conditional operator in case Color is null
                    Discount = new DiscountFormDTO
                    {
                        Name = x.Discount.Name,
                        IsDiscount = x.Discount.IsDiscount,
                        DiscountRate = x.Discount.DiscountRate,
                        StartDate = x.Discount.StartDate,
                        EndDate = x.Discount.EndDate
                    }
                }).FirstOrDefaultAsync();
            if (product.Color == null || product.Color == "None")
            {
                return product;
            }
            var colors = await GetAllColorsForProductAsync(product.Make, product.Model, (int)product.TypeId);
            product.Colors = colors;
            return product;
        }
        //-------------Makes and Models
        public async Task<IEnumerable<string>> AllMakeNamesAsync()
        {
            IEnumerable<string> makes = await dbContext.Products
               .AsNoTracking()
               .Select(x => x.Make)
               .Distinct()
               .ToListAsync();
            return makes;
        }
        public async Task<IEnumerable<string>> AllModelNamesAsync(string make)
        {
            IEnumerable<string> models = await dbContext.Products
               .AsNoTracking()
               .Where(x => x.Make == make)
               .Select(x => x.Model)
               .Distinct()
               .ToListAsync();
            return models;
        }
        //-------------Discount logic-------------
        public async Task<IEnumerable<DiscountViewDTO>> AllDiscountsAsync()
        {
            IEnumerable<DiscountViewDTO> discountDTO = await dbContext.Discounts //need fix
                .AsNoTracking()
                .Where(x=> !string.IsNullOrEmpty(x.Name))
                .GroupBy(x=> x.Name)
                .Select(x => new DiscountViewDTO
                {
                  Id = x.First().Id,
                  Name = x.First().Name
                })
                .ToListAsync();

            return discountDTO;
        }
        //-------------Color logic---------------

        public async Task<List<ColorProductIdDTO>> GetAllColorsForProductAsync(string make, string model, int typeId)
        {
            return await dbContext.Products.Where(x => x.Make == make && x.Model == model && x.TypeId == typeId)
                .Select(x => new ColorProductIdDTO
                {
                    ColorName = x.Color.Name,
                    ProductId = x.Id
                }).ToListAsync();
        }
    }
}
