
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ActivityAttendee>(entityBuilder =>
                entityBuilder.HasKey(activityAttendee => new { activityAttendee.ActivityId, activityAttendee.AppUserId })
            );

            builder.Entity<ActivityAttendee>()
                .HasOne(activityAttendee => activityAttendee.Activity)
                .WithMany(activity => activity.Attendees)
                .HasForeignKey(activityAttendee => activityAttendee.ActivityId);

            builder.Entity<ActivityAttendee>()
                .HasOne(activityAttendee => activityAttendee.AppUser)
                .WithMany(user => user.Activities)
                .HasForeignKey(activityAttendee => activityAttendee.AppUserId);

            builder.Entity<Comment>()
                .HasOne(c => c.Activity)
                .WithMany(a => a.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(builder => {
                builder.HasKey(uf => new { uf.ObserverId, uf.TargetId });
            });

            builder.Entity<UserFollowing>()
                .HasOne(uf => uf.Observer)
                .WithMany(u => u.Followings)
                .HasForeignKey(uf => uf.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);;

            builder.Entity<UserFollowing>()
                .HasOne(uf => uf.Target)
                .WithMany(u => u.Followers)
                .HasForeignKey(uf => uf.TargetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}