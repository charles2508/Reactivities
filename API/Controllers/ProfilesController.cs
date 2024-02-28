using Application.Profiles;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController: BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query {UserName = username}));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetEvent(string username, [FromQuery] string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query {UserName = username, Predicate = predicate}));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile(AppUser user)
        {
            return HandleResult(await Mediator.Send(new Edit.Command {Bio = user.Bio, DisplayName = user.DisplayName}));
        }
    }
}