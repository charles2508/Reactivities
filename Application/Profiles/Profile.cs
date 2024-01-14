using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Profiles
{
    // User profile (attendee profile)
    public class Profile
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
    }
}