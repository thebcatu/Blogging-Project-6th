import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { 
  fetchBlogs, 
  fetchTrendingBlogs, 
  fetchRecommendedBlogs 
} from '../../redux/slices/blogSlice';
import BlogCard from '../../components/blog/BlogCard';
import BlogCardSkeleton from '../../components/blog/BlogCardSkeleton';
import Pagination from '../../components/common/Pagination';

const HomeFeed = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    blogs, 
    trendingBlogs, 
    recommendedBlogs, 
    pagination, 
    isLoading 
  } = useSelector(state => state.blog);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  
  useEffect(() => {
    // Fetch main blogs with pagination and search if needed
    const params = { page: currentPage };
    if (query) {
      params.q = query;
    }
    dispatch(fetchBlogs(params));
    
    // Fetch trending blogs
    dispatch(fetchTrendingBlogs());
    
    // Fetch recommended blogs if user is authenticated
    if (isAuthenticated) {
      dispatch(fetchRecommendedBlogs());
    }
  }, [dispatch, currentPage, query, isAuthenticated]);
  
  return (
    <div>
      {query && (
        <h1 className="text-2xl font-bold mb-6">
          Search Results for: <span className="text-primary-600">"{query}"</span>
        </h1>
      )}
      
      {!query && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">🔥</span> Trending Blogs
          </h2>
          
          {isLoading && trendingBlogs.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : trendingBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingBlogs.slice(0, 3).map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No trending blogs found.</p>
          )}
        </div>
      )}
      
      {isAuthenticated && !query && recommendedBlogs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">✨</span> Recommended For You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedBlogs.slice(0, 3).map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-bold mb-4">
          {query ? 'Search Results' : 'Latest Blogs'}
        </h2>
        
        {isLoading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(pagination.count / 10)}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {query ? 'No blogs matching your search.' : 'No blogs available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeFeed;
