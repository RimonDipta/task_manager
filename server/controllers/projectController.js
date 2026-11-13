import Project from "../models/Project.js";

// @desc Get all projects
// @route GET /api/projects
export const getProjects = async (req, res) => {
    try {
        // Archived projects are hidden by default, same convention as archived tasks.
        const query = { user: req.user };
        if (req.query.archived === "true") {
            query.archived = true;
        } else if (req.query.archived !== "all") {
            query.archived = { $ne: true };
        }

        const projects = await Project.find(query).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error fetching projects" });
    }
};

// @desc Create project
// @route POST /api/projects
export const createProject = async (req, res) => {
    try {
        const { name, color, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Project name is required" });
        }

        const project = await Project.create({
            user: req.user,
            name,
            color,
            description,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Server Error creating project" });
    }
};

// @desc Update project (name, color, description, archived)
// @route PUT /api/projects/:id
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.user.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { name, color, description, archived } = req.body;
        if (name !== undefined) project.name = name;
        if (color !== undefined) project.color = color;
        if (description !== undefined) project.description = description;
        if (archived !== undefined) project.archived = archived;

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Server Error updating project" });
    }
};

// @desc Delete project
// @route DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.user.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await project.deleteOne();
        res.json({ message: "Project removed" });
    } catch (error) {
        res.status(500).json({ message: "Server Error deleting project" });
    }
};
