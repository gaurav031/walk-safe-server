import express from 'express';
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// Get a single post by ID
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the post and populate the 'creator' field with user details
    const post = await PostMessage.findById(id).populate('creator');

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get posts with pagination
export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // Calculate the starting index
    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get posts by search query
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i'); // 'i' for case insensitive

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: "Conflict: Could not save the post" });
  }
};

// Update an existing post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(
      id,
      { ...post, _id: id },
      { new: true } // Return the updated document
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Could not update the post" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    await PostMessage.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete the post" });
  }
};

// Like or Unlike a post
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthenticated!' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  try {
    const post = await PostMessage.findById(id);

    if (!post) {
      return res.status(404).send(`No post found with id: ${id}`);
    }

    const index = post.likes.findIndex((userId) => userId === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId); // Like the post
    } else {
      post.likes = post.likes.filter((userId) => userId !== String(req.userId)); // Unlike the post
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Add a comment to a post
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (!value || !value.trim()) { // Check for empty or whitespace-only comments
      return res.status(400).json({ message: 'Invalid comment value' });
    }

    const post = await PostMessage.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comment.push(value);

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};