"use client";

import { useRouter } from "next/navigation";
import { deleteProject, fetchToken } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ProjectActions = ({ projectId }: { projectId: string }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDeleteProject = async () => {
      setIsDeleting(true);
  
      try {
        const { token } = await fetchToken();
        await deleteProject(projectId, token);
  
        router.push("/");
      } catch (error) {
        console.error("Error in handleDeleteProject: ", error);
      } finally {
        setIsDeleting(false);
      }
    };

  return (
    <>
      <Link
        href={`/edit-project/${projectId}`}
        className="flexCenter edit-action_btn"
      >
        <Image src="/pencil.svg" width={15} height={15} alt="edit" />
      </Link>

      <button
        type="button"
        className={`flexCenter delete-action_btn ${
          isDeleting ? "bg-gray" : "bg-primary-purple"
        }`}
        onClick={handleDeleteProject}
      >
        <Image src="/trash.svg" width={15} height={15} alt="delete" />
      </button>
    </>
  );
};

export default ProjectActions;
