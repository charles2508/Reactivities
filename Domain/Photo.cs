namespace Domain
{
    public class Photo
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string AppUserId { get; set; }
        public AppUser User { get; set; }
    }
}