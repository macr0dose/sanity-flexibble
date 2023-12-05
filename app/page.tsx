"use client"
import { useState, useEffect } from "react";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import SkeletonLoader from "@/components/SkeletonLoader"; // Import your SkeletonLoader component
import { fetchAllProjects } from "@/lib/actions";

interface ProjectInterface {
  id: string;
  image: string;
  title: string;
  createdBy: {
    name: string;
    avatarUrl: string;
    id: string;
  };
}

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

type Props = {
  searchParams: {
    category?: string;
    endCursor?: string;
  };
};

const Home = ({ searchParams: { category, endCursor } }: Props) => {
  const [loading, setLoading] = useState(true);
  const [projectsToDisplay, setProjectsToDisplay] = useState<ProjectInterface[]>([]);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = (await fetchAllProjects(category, endCursor)) as ProjectSearch;
        setProjectsToDisplay(data.projectSearch.edges.map(edge => edge.node));
        setPagination(data.projectSearch.pageInfo || {});
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
            {projectsToDisplay.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                image={project.image}
                title={project.title}
                name={project.createdBy.name}
                avatarUrl={project.createdBy.avatarUrl}
                userId={project.createdBy.id}
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