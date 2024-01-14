using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(attendee => attendee.AppUser)
                    .FirstOrDefaultAsync(a => a.Id == request.Id);
                
                if (activity == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var hostName = activity.Attendees.FirstOrDefault(attendees => attendees.IsHost).AppUser.UserName;
                var attendenceStatus = activity.Attendees.FirstOrDefault(attendees => attendees.AppUser.UserName == user.UserName);

                if (attendenceStatus != null)
                {
                    if (user.UserName == hostName)
                    {
                        activity.IsCancelled = !activity.IsCancelled;
                    } else
                    {
                        activity.Attendees.Remove(attendenceStatus);
                    }
                } else
                {
                    var attendence = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendence);
                }

                var result = await _context.SaveChangesAsync() > 0;
                if (result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Fail to add attendance");
            }
        }
    }
}