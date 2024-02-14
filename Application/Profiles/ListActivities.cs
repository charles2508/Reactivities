using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query: IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }

        public class Handler: IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = new List<ActivityAttendee>();
                if (request.Predicate == "hosting")
                {
                    activities = await _context.ActivityAttendees
                                        .Where(aa => aa.IsHost)
                                        .Include(aa => aa.Activity)
                                        .Include(aa => aa.AppUser)
                                        .Where(aa => aa.AppUser.UserName == request.UserName)
                                        .OrderBy(aa => aa.Activity.Date)
                                        .ToListAsync();
                } else 
                {
                    var query = _context.ActivityAttendees
                                                .Include(aa => aa.AppUser)
                                                .Include(aa => aa.Activity)
                                                .Where(aa => aa.AppUser.UserName == request.UserName)
                                                .OrderBy(aa => aa.Activity.Date)
                                                .AsQueryable();
                    if (request.Predicate == "future")
                    {
                        query = query.Where(aa => aa.Activity.Date > DateTime.Now);
                    } else
                    {
                        query = query.Where(aa => aa.Activity.Date <= DateTime.Now);
                    }
                    activities = await query.ToListAsync();
                }
                var userActivities = _mapper.Map<List<UserActivityDto>>(activities);
                return Result<List<UserActivityDto>>.Success(userActivities);
            }
        }
    }
}