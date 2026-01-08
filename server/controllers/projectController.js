import Project from "../models/Project.js";

// @desc Get all projects
// @route GET /api/projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user }).sort({ createdAt: -1 });
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
