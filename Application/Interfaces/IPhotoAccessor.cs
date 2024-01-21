using Application.Photos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        public Task<PhotoUploadResult> AddPhoto(IFormFile file);
        public Task<string> DeletePhoto(string publicId);
    }
}