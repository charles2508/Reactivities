using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly IHostEnvironment _env;
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _logger = logger;
            _next = next;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                var exception = _env.IsDevelopment()
                                    ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                                    : new AppException(context.Response.StatusCode, "Internal Server Error");

                var options = new JsonSerializerOptions {PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                var jsonString = JsonSerializer.Serialize(exception, options);
                await context.Response.WriteAsync(jsonString); //similar to context.Response.Body = jsonString;
            }
        }
    }
}