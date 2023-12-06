import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="space-y-4 p-4">
      {/* Image placeholder with shimmer */}
      <div className="h-60 bg-purple-500 rounded-lg relative overflow-hidden">
        <div className="shimmer absolute w-full h-full"></div>
        <div className="text-xl text-center">Loading...</div>
      </div>
      <div className="h-4 bg-purple-500 rounded w-full"></div>{" "}
      {/* Title placeholder */}
      <div className="h-4 bg-purple-500 rounded w-1/4"></div>{" "}
      {/* Subtitle placeholder */}
    </div>
  );
};

export default SkeletonLoader;
