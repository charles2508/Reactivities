using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {    
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dbContext;
        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;
            
            var activityId = Guid.Parse(
                _httpContextAccessor.HttpContext?.Request.RouteValues.FirstOrDefault(r => r.Key == "id").Value?.ToString()
            );

            var activityAttendee = _dbContext.ActivityAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(a => a.AppUserId == userId && a.ActivityId == activityId)
                .Result;

            if (activityAttendee == null) return Task.CompletedTask;

            if (activityAttendee.IsHost)
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            return Task.CompletedTask;
        }
    }
}