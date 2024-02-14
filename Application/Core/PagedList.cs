using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T>: List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            AddRange(items);
            CurrentPage = pageNumber;
            TotalCount = count;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling((double)TotalCount/PageSize);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> queryable, int pageSize, int currentPage)
        {
            var count = await queryable.CountAsync();
            var items = await queryable.Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, count, currentPage, pageSize);
        }
    }
}