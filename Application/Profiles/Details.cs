using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query: IRequest<Result<Profile>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                /*var user = await _context.Users
                                        .Include(u => u.Photos)
                                        .Include(u => u.Followers)
                                        .ThenInclude(uf => uf.Observer)
                                        .Include(u => u.Followings)
                                        .FirstOrDefaultAsync(u => u.UserName == request.UserName);*/
                var user = await _context.Users
                                .ProjectTo<Profile>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUserName()})
                                .FirstOrDefaultAsync(u => u.UserName == request.UserName);
                if (user == null) return null;
                //var profile = _mapper.Map<Profile>(user);
                //profile.Following = user.Followers.Any(f => f.Observer.UserName == _userAccessor.GetUserName());
                return Result<Profile>.Success(user);
            }
        }
    }
}