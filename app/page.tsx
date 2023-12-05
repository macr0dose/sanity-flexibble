"use client"
import { useState, useEffect } from "react";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";
import SkeletonLoader from "@/components/SkeletonLoader";

// Define interfaces
interface ProjectInterface {
  id: string;
  image: string;
  title: string;
  name: string;
  avatarUrl: string;
  userId: string;
}

interface PaginationInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

type SearchParams = {
  category?: string;
  endCursor?: string;
}

type ProjectSearchData = {
  projectSearch: {
    edges: { node: ProjectInterface }[];
    pageInfo: PaginationInfo;
  };
};

type Props = {
  searchParams: SearchParams;
}

const Home = ({ searchParams: { category, endCursor } }: Props) => {
  const [loading, setLoading] = useState(true);
  const [projectsToDisplay, setProjectsToDisplay] = useState<ProjectInterface[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ hasPreviousPage: false, hasNextPage: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await fetchAllProjects(category, endCursor)) as ProjectSearchData;
        setProjectsToDisplay(data.projectSearch.edges.map(edge => edge.node));
        setPagination(data.projectSearch.pageInfo);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [category, endCursor]);

  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories />

      {loading ? (
        <SkeletonLoader count={5} /> // Adjust 'count' as needed
      ) : (
        <>
          <section className="projects-grid">
            {projectsToDisplay.map((project: ProjectInterface) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                image={project.image}
                title={project.title}
                name={project.name}
                avatarUrl={project.avatarUrl}
                userId={project.userId}
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
