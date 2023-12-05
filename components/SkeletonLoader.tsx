interface SkeletonLoaderProps {
    count: number;
  }
  
  const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count }) => {
    return (
      <>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="skeleton-loader">
            {/* Your skeleton loader markup here */}
          </div>
        ))}
      </>
    );
  };
  
  export default SkeletonLoader;