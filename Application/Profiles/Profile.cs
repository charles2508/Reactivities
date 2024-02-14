using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Photos;

namespace Application.Profiles
{
    // User profile (attendee profile)
    public class Profile
    {
        public string DisplayName { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public bool Following { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingsCount { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}