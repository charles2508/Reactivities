using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query: IRequest<Result<ActivityDto>> 
        {
            public Guid Id  { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                                            .Include(a => a.Attendees)
                                            .ThenInclude(attendees => attendees.AppUser)
                                            .ThenInclude(u => u.Photos)
                                            .FirstOrDefaultAsync(a => a.Id == request.Id);
                var activityDto = _mapper.Map<ActivityDto>(activity);

                return Result<ActivityDto>.Success(activityDto);
            }
        }
    }
}