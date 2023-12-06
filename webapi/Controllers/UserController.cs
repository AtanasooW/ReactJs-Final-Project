using ASNClub.Data.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ASNClub.Services.UserServices.Contracts;
using webapi.Areas.Identity.Pages.Account;
using ASNClub.DTOs.User;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ASNClub.Common;

namespace webapi.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserServices _userServices;
        private readonly ILogger<LoginModel> _logger;
        private readonly IConfiguration _config;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        public UserController(UserManager<ApplicationUser> userManager,
            IUserServices userServices,
            ILogger<LoginModel> logger,
            IConfiguration config,
            RoleManager<IdentityRole<Guid>> roleManager
            )

        {
            _userManager = userManager;
            _userServices = userServices;
            _logger = logger;
            _config = config;
            _roleManager = roleManager;
        }
        [HttpPost("Registration")]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDTO userForRegistration)
        {
            if (userForRegistration == null || !ModelState.IsValid)
                return BadRequest();
            var user = new ApplicationUser
            {
                Email = userForRegistration.Email,
                FirstName = userForRegistration.FirstName,
                Surname = userForRegistration.SurName,
                UserName = userForRegistration.UserName,
                Id = Guid.NewGuid()
            };
            var result = await _userManager.CreateAsync(user, userForRegistration.Password);
            if (!result.Succeeded)
            {
                return BadRequest("Result unsuccessful");
            }

            return StatusCode(201);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> LogUser([FromBody] UserForLoginDTO userForRegistration)
        {
            if (userForRegistration == null || !ModelState.IsValid)
                return BadRequest();
            var user = await _userManager.FindByEmailAsync(userForRegistration.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, userForRegistration.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                var Claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                foreach (var item in userRoles)
                {
                    Claims.Add(new Claim(ClaimTypes.Role, item));
                }
                var token = GetJWTToken(Claims);
                return Ok((new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                }));
            }
            return Unauthorized();

        }
        [HttpPost]
        [Route("RegisterMod")]
        public async Task<IActionResult> RegisterMod([FromBody] UserForRegistrationDTO model)
        {
            var userExists = await _userManager.FindByNameAsync(model.UserName);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError);

            ApplicationUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.UserName
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError);

            if (!await _roleManager.RoleExistsAsync(UserRoles.Moderator))
                await _roleManager.CreateAsync(new IdentityRole<Guid>(UserRoles.Moderator));
            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                await _roleManager.CreateAsync(new IdentityRole<Guid>(UserRoles.User));

            if (await _roleManager.RoleExistsAsync(UserRoles.Moderator))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Moderator);
            }
            if (await _roleManager.RoleExistsAsync(UserRoles.Moderator))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.User);
            }
            return Ok();
        }
        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser(string username)
        {
            var user = await _userServices.GetUserByUsername(username);
            if (await _userManager.IsInRoleAsync(user, "Moderator"))
            {
                return Ok(new { user, Role = "Moderator" });
            }

            return Ok(new { user, Role = "User" });
        }
        private JwtSecurityToken GetJWTToken(List<Claim> claims)
        {
            var issuer = _config["JWT:ValidIssuer"];
            var audience = _config["JWT:ValidAudience"];
            var key = _config["JWT:SecretKey"];
            if (string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience) || string.IsNullOrEmpty(key)) {
                throw new ArgumentException();
            }
            var SigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var jwt = new JwtSecurityToken(
                  issuer: issuer,
                  audience: audience,
                  expires: DateTime.Now.AddHours(3),
                  claims: claims,
                  signingCredentials: new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256)
                );
            return jwt;
            
        }

    }
}
