using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
                //.ForMember(s => s.IsCancelled, opt => opt.Ignore());

            // Need to instruct (configure) the Mapper so that it knows how to map from Activity -> ActivityDto with the following props:
            // - HostUserName
            // - Attendees 
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
            
            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
        }
    }
}