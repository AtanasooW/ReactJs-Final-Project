using System.ComponentModel.DataAnnotations;

namespace ASNClub.DTOs.User
{
    public class UserForRegistrationDTO
    {
        public string? FirstName { get; set; }
        public string? SurName { get; set; }
        [Required(ErrorMessage = "Username is required.")]
        public string? UserName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; }
    }

}