const express = require('express');
const router = express.Router();
const { Post, Comment } = require('../models');

// Render the homepage with existing blog posts
router.get('/', async (req, res) => {
  try {
    // Fetch all blog posts
    const posts = await Post.findAll({
      include: [{ model: Comment }],
      order: [['createdAt', 'DESC']], // Order by creation date in descending order
    });

    // Render the homepage with blog posts
    res.render('home', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve blog posts.' });
  }
});

// Render an individual blog post with comments
router.get('/posts/:id', async (req, res) => {
  try {
    // Fetch the specified blog post and its comments
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Comment }],
    });

    // Render the blog post page with comments
    res.render('post', { post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve the blog post.' });
  }
});

// Handle adding a new comment to a blog post
router.post('/posts/:id/comment', async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    // Create a new comment for the specified blog post
    await Comment.create({
      content,
      post_id: postId,
    });

    // Redirect back to the blog post page after adding the comment
    res.redirect(`/posts/${postId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add a new comment.' });
  }
});

module.exports = router;
