using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class List
    {
        public class Query: IRequest<Result<List<CommentDto>>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _context.Comments
                                            .Include(c => c.Author)
                                            .ThenInclude(a => a.Photos)
                                            .Include(c => c.Activity)
                                            .Where(c => c.Activity.Id == request.ActivityId)
                                            .OrderByDescending(c => c.CreatedAt)
                                            .ToListAsync();
                return Result<List<CommentDto>>.Success(_mapper.Map<List<CommentDto>>(comments));
            }
        }
    }
}