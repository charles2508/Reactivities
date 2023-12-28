using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected IActionResult HandleResult<T>(Result<T> result) 
        {
            if (result == null) return NotFound();
            if (result.IsSuccess) {
                if (result.Value != null) {
                    return Ok(result.Value);
                } else {
                    return NotFound();
                }
            } else {
                return BadRequest(result.Error);
            }
        }
    }
}