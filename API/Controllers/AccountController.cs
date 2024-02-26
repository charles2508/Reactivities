

using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;   
        }

        private UserDto CreateUserDtoFromUser(AppUser user)
        {
            return new UserDto
            {
                UserName = user.UserName,
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(p => p.IsMain)?.Url,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task CreateRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();
            foreach(var token in user.RefreshTokens)
            {
                if (token.IsActive)
                {
                    token.Revoked = DateTime.UtcNow;
                }
            }
            
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .Include(u => u.Photos)
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (result)
            {
                await CreateRefreshToken(user);
                return Ok(CreateUserDtoFromUser(user));
            }
            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = await _userManager.FindByNameAsync(registerDto.UserName);
            if (user != null) {
                ModelState.AddModelError("username", "Username already exists");
            }
            
            user = await _userManager.FindByEmailAsync(registerDto.Email);
            if (user != null) {
                ModelState.AddModelError("email", "Email already exists");
            }
            
            if (ModelState.ErrorCount > 0) return ValidationProblem();

            var newUser = new AppUser
            {
                Email = registerDto.Email,
                UserName = registerDto.UserName,
                DisplayName = registerDto.DisplayName
            };
            var result = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (result.Succeeded)
            {
                await CreateRefreshToken(newUser);
                return Ok(CreateUserDtoFromUser(newUser));
            }

            return BadRequest(result.Errors);
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            // User object always references to the pre-defined Token's payload ClaimPrinciples in the ControllerBase
            var user = await _userManager.Users
                .Include(u => u.Photos)
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));
            await CreateRefreshToken(user);
            return Ok(CreateUserDtoFromUser(user));
        }

        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user =  await _userManager.Users
                                .Include(u => u.RefreshTokens)
                                .Include(u => u.Photos)
                                .FirstOrDefaultAsync(u => u.UserName == User.FindFirstValue(ClaimTypes.Name));
            
            if (user.RefreshTokens.Any(rt => rt.Token == refreshToken && rt.IsActive))
            {
                return Ok(CreateUserDtoFromUser(user));
            }
            return Unauthorized();
        }
    }
}