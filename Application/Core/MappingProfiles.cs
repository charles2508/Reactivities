using Application.Activities;
using Application.Comments;
using Application.Photos;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
            string currentUserName = "";
            CreateMap<Activity, Activity>()
                .ForMember(s => s.IsCancelled, opt => opt.Ignore());

            // Need to instruct (configure) the Mapper so that it knows how to map from Activity -> ActivityDto with the following props:
            // - HostUserName
            // - Attendees 
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
            
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.FollowingsCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(uf => uf.Observer.UserName == currentUserName)));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(p => p.Image, o => o.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(p => p.FollowersCount, o => o.MapFrom(u => u.Followers.Count))
                .ForMember(p => p.FollowingsCount, o => o.MapFrom(u => u.Followings.Count))
                .ForMember(p => p.Following, o => o.MapFrom(u => u.Followers.Any(uf => uf.Observer.UserName == currentUserName)));

            CreateMap<Photo, PhotoDto>();

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.UserName, o => o.MapFrom(c => c.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(c => c.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(c => c.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
            
            CreateMap<ActivityAttendee, Profiles.UserActivityDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.ActivityId))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.Activity.Title))
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Activity.Category))
                .ForMember(d => d.Date, o => o.MapFrom(s => s.Activity.Date));
        }
    }
}