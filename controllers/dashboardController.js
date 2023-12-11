const { User, Post } = require('../models');

const dashboardController = {
  // Render the user's dashboard with their blog posts
  renderDashboard: async (req, res) => {
    try {
      // Check if the user is authenticated
      if (!req.session.user_id) {
        return res.redirect('/login');
      }

      // Fetch the user's blog posts
      const userData = await User.findByPk(req.session.user_id, {
        include: [{ model: Post }],
        attributes: { exclude: ['password'] }, // Exclude password from the response
      });

      const user = userData.get({ plain: true });

      // Render the dashboard view with the user's data
      res.render('dashboard', { user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to render the dashboard.' });
    }
  },

  // Handle the creation of a new blog post
  createPost: async (req, res) => {
    try {
      // Check if the user is authenticated
      if (!req.session.user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Create a new post for the authenticated user
      await Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id,
      });

      // Redirect to the dashboard after creating the post
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create the blog post.' });
    }
  },

  // Handle the deletion of a blog post
  deletePost: async (req, res) => {
    try {
      // Check if the user is authenticated
      if (!req.session.user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete the specified post for the authenticated user
      await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      // Redirect to the dashboard after deleting the post
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete the blog post.' });
    }
  },
};

module.exports = dashboardController;
