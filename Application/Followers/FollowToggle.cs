using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;  
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                var target = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);

                if (observer == null || target == null) return null;

                var userFollowing = await _context.UserFollowings.FindAsync(observer.Id, target.Id);
                if (userFollowing == null) {
                    userFollowing = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(userFollowing);
                } else
                {
                    _context.UserFollowings.Remove(userFollowing);
                }
                var result = await _context.SaveChangesAsync() > 0;
                if (result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Fail to toggle the following feature");
            }
        }
    }
}