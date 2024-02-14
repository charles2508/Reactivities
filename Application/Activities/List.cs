using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query: IRequest<Result<PagedList<ActivityDto>>> {
            public ActivitityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler (DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(a => a.Date >= request.Params.StartDate)
                    .OrderBy(a => a.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUserName()})
                    .AsQueryable();

                if (request.Params.IsGoing)
                {
                    query = query.Where(activityDto => activityDto.Attendees.Any(attendeeDto => attendeeDto.UserName == _userAccessor.GetUserName()));
                } else if (request.Params.IsHost)
                {
                    query = query.Where(activityDto => activityDto.HostUsername == _userAccessor.GetUserName());
                }
                // In order to solve the problem of an infinite loop: "A possible object cycle was detected" that is:
                // activity -> Attendees -> activity -> Attendees -> ...
                // We have to create a new ActivityDTO
                //var activitiesDTO = _mapper.Map<List<ActivityDto>>(activities);

                // Alternatively, can use:
                // var activities = await _context.Activities.ProjectTo<ActivityDto>(_mapper.ConfigurationProvider).ToListAsync();
                // and we dont need to map List<activities> => List<activitydto> again
                var activities = await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageSize, request.Params.PageNumber);
                return Result<PagedList<ActivityDto>>.Success(activities);
            }
        }
    }
}