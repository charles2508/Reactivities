using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        // config object can access Appsettings.json and Appsettings.Development.json
       public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
       {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt => {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });

            services.AddMediatR(conf => conf.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));

            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>();

            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();

            services.AddAuthorization(opt => {
                opt.AddPolicy("IsHostRequirement", policy => {
                    policy.AddRequirements(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            
            return services;
       } 
    }
}