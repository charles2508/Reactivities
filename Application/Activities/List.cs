using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query: IRequest<Result<List<ActivityDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler (DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities.Include(activity => activity.Attendees).ThenInclude(attendees => attendees.AppUser).ToListAsync();
                // In order to solve the problem of an infinite loop: "A possible object cycle was detected" that is:
                // activity -> Attendees -> activity -> Attendees -> ...
                // We have to create a new ActivityDTO
                var activitiesDTO = _mapper.Map<List<ActivityDto>>(activities);

                // Alternatively, can use:
                // var activities = await _context.Activities.ProjectTo<ActivityDto>(_mapper.ConfigurationProvider).ToListAsync();
                // and we dont need to map List<activities> => List<activitydto> again
                return Result<List<ActivityDto>>.Success(activitiesDTO);
            }
        }
    }
}