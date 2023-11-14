using ASNClub.Data;
using ASNClub.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ASNClub.Services.UserServices.Contracts;

namespace ASNClub.Services.UserServices
{
    public class UserServices : IUserServices
    {
        private readonly ASNClubDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        public UserServices(ASNClubDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            this._dbContext = dbContext;
            this._userManager = userManager;
        }
        public async Task<ApplicationUser> GetUserByUsername(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            return user;
        }
        public async Task<ApplicationUser> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            return user;
        }
        public async Task<ApplicationUser> GetUserById(Guid Id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == Id);
            return user;
        }
    }
}
