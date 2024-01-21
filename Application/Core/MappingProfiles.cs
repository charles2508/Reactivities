using Application.Activities;
using Application.Photos;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
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
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(p => p.Image, o => o.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<Photo, PhotoDto>();
        }
    }
}