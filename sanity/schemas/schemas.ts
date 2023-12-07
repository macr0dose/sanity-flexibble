const userSchema = {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required().min(2).max(100),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: "avatarUrl",
      title: "Avatar URL",
      type: "url",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
      validation: (Rule: any) => Rule.min(2).max(1000),
    },
    {
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    },
    {
      name: "linkedInUrl",
      title: "LinkedIn URL",
      type: "url",
    },
    {
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    },
  ],
};

const projectSchema = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required().min(3),
    },
    {
      name: "description",
      title: "Description",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "image",
      title: "Image",
      type: "url",
    },
    {
      name: "liveSiteUrl",
      title: "Live Site URL",
      type: "url",
    },
    {
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "createdBy",
      title: "Created By",
      type: "reference",
      to: [{ type: "user" }],
    },
  ],
};

export const schemas = [userSchema, projectSchema];
