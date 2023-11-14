using ASNClub.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASNClub.Services.UserServices.Contracts
{
    public interface IUserServices
    {
        public Task<ApplicationUser> GetUserByUsername(string username);
        public Task<ApplicationUser> GetUserByEmail(string email);
        public Task<ApplicationUser> GetUserById(Guid Id);

    }
}