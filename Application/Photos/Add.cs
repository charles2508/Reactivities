using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command: IRequest<Result<PhotoDto>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<PhotoDto>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor, IMapper mapper)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;              
            }
            public async Task<Result<PhotoDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = _context.Users
                    .Include(u => u.Photos)
                    .SingleOrDefault(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var uploadResult = await _photoAccessor.AddPhoto(request.File);
                if (uploadResult != null)
                {
                    var photo = new Photo
                    {
                        Id = uploadResult.PublicId,
                        Url = uploadResult.Url
                    };

                    var mainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);
                    if (mainPhoto == null)
                    {
                        photo.IsMain = true;
                    }

                    user.Photos.Add(photo);
                    var result = await _context.SaveChangesAsync() > 0;
                    
                    if (result) return Result<PhotoDto>.Success(_mapper.Map<PhotoDto>(photo));
                }
                
                return Result<PhotoDto>.Failure("Fail to upload photo");
            }
        }
    }
}