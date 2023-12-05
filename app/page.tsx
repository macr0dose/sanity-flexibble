"use client"

import React, { useState, useEffect } from 'react';
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import { fetchAllProjects } from "@/lib/actions";
import ProjectCard from "@/components/ProjectCard";

// Skeleton Loader Component
const ProjectCardSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4 p-4 border border-gray-300 shadow rounded-md max-w-sm w-full mx-auto">
      <div className="rounded bg-gray-300 h-32 w-full"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );
};

type SearchParams = {
  category?: string;
  endCursor?: string;
}

type HomeProps = {
  searchParams: SearchParams;
}

const Home = ({ searchParams: { category, endCursor } }: HomeProps) => {
  const [loading, setLoading] = useState(true);
  const [projectsToDisplay, setProjectsToDisplay] = useState([]);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllProjects(category, endCursor);
        setProjectsToDisplay(data.projectSearch.edges || []);
        setPagination(data.projectSearch.pageInfo || {});
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchData();
  }, [category, endCursor]);

  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories />

      {loading ? (
        <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <section className="projects-grid">
            {projectsToDisplay.map(({ node }) => (
              <ProjectCard
                key={node.id}
                id={node.id}
                image={node.image}
                title={node.title}
                name={node.createdBy.name}
                avatarUrl={node.createdBy.avatarUrl}
                userId={node.createdBy.id}
              />
            ))}
          </section>

          <LoadMore
            startCursor={pagination.startCursor}
            endCursor={pagination.endCursor}
            hasPreviousPage={pagination.hasPreviousPage}
            hasNextPage={pagination.hasNextPage}
          />
        </>
      )}
    </section>
  );
};

export default Home;