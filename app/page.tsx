"use client"
import React, { useState, useEffect } from "react";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import SkeletonLoader from "@/components/SkeletonLoader"; // Make sure this path is correct
import { fetchAllProjects } from "@/lib/actions";
import { ProjectInterface } from "@/common.types";

type SearchParams = {
  category?: string;
  endCursor?: string;
};

type Props = {
  searchParams: SearchParams;
};

type ProjectSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
};

const Home = ({ searchParams: { category, endCursor } }: Props) => {
  const [loading, setLoading] = useState(true);
  const [projectsToDisplay, setProjectsToDisplay] = useState([]);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await fetchAllProjects(category, endCursor)) as ProjectSearch;
        setProjectsToDisplay(data.projectSearch.edges || []);
        setPagination(data.projectSearch.pageInfo || {});
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [category, endCursor]);

  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories />

      {loading ? (
        <SkeletonLoader count={5} /> // Adjust 'count' based on how many loaders you want
      ) : (
        <>
          <section className="projects-grid">
            {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
              <ProjectCard
                key={node?.id}
                id={node?.id}
                image={node?.image}
                title={node?.title}
                name={node?.createdBy?.name}
                avatarUrl={node?.createdBy?.avatarUrl}
                userId={node?.createdBy?.id}
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
