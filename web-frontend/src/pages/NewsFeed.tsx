import React, { useEffect, useState } from 'react';
import './NewsFeed.css';

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  category: string; // e.g. Achievement, Position, Project, Academic
  datePosted: Date;
}

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Academic');

  // Placeholder: Fetch posts from your API or backend service.
  const fetchPosts = async () => {
    // For example:
    // const response = await fetch('/api/posts');
    // const data = await response.json();
    // setPosts(data);
    // Demo dummy data:
    const dummyPosts: Post[] = [
      {
        id: 1,
        author: 'Professor John Doe',
        title: 'New Research Achievement',
        content:
          'I am thrilled to share that my team and I have published a breakthrough paper on machine learning applications in genomics.',
        category: 'Achievement',
        datePosted: new Date('2025-04-10T10:30:00'),
      },
      {
        id: 2,
        author: 'Professor Jane Smith',
        title: 'Position Open for IP',
        content:
          'We are looking for a postdoctoral researcher in the domain of renewable energy systems. Ideal candidates must have experience in solar energy.',
        category: 'Position',
        datePosted: new Date('2025-04-11T14:15:00'),
      },
      {
        id: 3,
        author: 'Professor Alex Kim',
        title: 'BTP Project Launch',
        content:
          'Excited to announce a new BTP project focusing on sustainable urban transport. Interested students can apply now.',
        category: 'Project',
        datePosted: new Date('2025-04-12T08:00:00'),
      },
    ];
    // Sort posts in reverse chronological order.
    setPosts(dummyPosts.sort((a, b) => b.datePosted.getTime() - a.datePosted.getTime()));
  };

  // Placeholder: Function to create a new post.
  const createPost = async () => {
    // e.g. await api.createPost({ title: newPostTitle, content: newPostContent, category: newPostCategory });
    const newPost: Post = {
      id: posts.length + 1,
      author: 'You', // This can be dynamic
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      datePosted: new Date(),
    };
    // Update posts list by adding the new post at the top.
    setPosts([newPost, ...posts]);
    // Reset form fields.
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('Academic');
  };

  useEffect(() => {
    fetchPosts();

    // Optionally, set up polling or real-time subscription here.
    // Example: const intervalId = setInterval(fetchPosts, 60000);
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="newsfeed-container">
      <div className="newsfeed-header">
        <h2>Latest Academic News & Updates</h2>
      </div>
      <div className="newsfeed-create">
        <h3>Share an Update</h3>
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="newsfeed-input"
        />
        <textarea
          placeholder="What's on your mind? Share achievements, new positions, projects, etc."
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="newsfeed-textarea"
        />
        <select
          value={newPostCategory}
          onChange={(e) => setNewPostCategory(e.target.value)}
          className="newsfeed-select"
        >
          <option value="Academic">Academic</option>
          <option value="Achievement">Achievement</option>
          <option value="Position">Position</option>
          <option value="Project">Project</option>
        </select>
        <button onClick={createPost} className="newsfeed-submit-btn">
          Post Update
        </button>
      </div>
      <div className="newsfeed-posts">
        {posts.map((post) => (
          <div key={post.id} className="newsfeed-post-card">
            <div className="post-card-header">
              <h3 className="post-title">{post.title}</h3>
              <span className="post-category">{post.category}</span>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-footer">
              <span className="post-author">By {post.author}</span>
              <span className="post-date">{post.datePosted.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
