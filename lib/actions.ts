import { createClient } from '@sanity/client';

// Configure the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Ensure this is set in your environment
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Ensure this is set in your environment
  apiVersion: '2021-03-25',
  token: process.env.SANITY_API_TOKEN, // Optional: only needed for write operations
  useCdn: process.env.NODE_ENV === 'production',
});

// Fetch all projects
export const fetchAllProjects = async (category?: string, endCursor?: string) => {
  let query = '*[_type == "project"] | order(_createdAt desc) [0...20]';
  const params: Record<string, unknown> = {};

  if (category) {
    query = `*[_type == "project" && category == $category] | order(_createdAt desc) [0...20]`;
    params.category = category;
  }

  if (endCursor) {
    params.endCursor = endCursor;
  }

  return await client.fetch(query, params);
};

// Get project details by ID
export const getProjectDetails = async (id: string) => {
  const query = `*[_type == "project" && _id == $id][0]`;
  return await client.fetch(query, { id });
};

// Create a new project
export const createNewProject = async (projectData: any) => {
  return await client.create({
    _type: 'project',
    ...projectData,
  });
};

// Update an existing project
export const updateProject = async (projectId: string, projectData: any) => {
  return await client.patch(projectId)
    .set(projectData)
    .commit();
};

// Delete a project by ID
export const deleteProject = async (id: string) => {
  return await client.delete(id);
};

// Additional functions can be added here as needed, following a similar pattern.
