using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query: IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();
                // Using projection here
                switch(request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings.Where(uf => uf.Target.UserName == request.UserName)
                                                              .Select(uf => uf.Observer)
                                                              .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUserName()})
                                                              .ToListAsync();
                        break;
                    case "following":
                        profiles = await _context.UserFollowings.Where(uf => uf.Observer.UserName == request.UserName)
                                                              .Select(uf => uf.Target)
                                                              .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUserName()})
                                                              .ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}