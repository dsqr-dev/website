// File-based content handling for MDX posts
import type { PostCategory } from './types'
import { getPostViews, preloadPostViews } from './views'

export type Post = {
  _id: string
  title: string
  date: string
  category: PostCategory
  description?: string
  slug: string
  url: string
  content: string
  views?: number
}

// Path to the content files in the public directory
const contentDir = '/content/posts';

// Function to get frontmatter from MDX content
function extractFrontmatter(content: string) {
  const frontmatterRegex = /---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return {};
  
  const frontmatterStr = match[1];
  const frontmatter: Record<string, any> = {};
  
  // Extract key-value pairs
  if (!frontmatterStr) return {};
  const lines = frontmatterStr.split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      // Join the value parts back together and trim quotes if present
      let value = valueParts.join(':').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      frontmatter[key.trim()] = value;
    }
  }
  
  return frontmatter;
}

// Function to get content without frontmatter
function extractContent(content: string) {
  const frontmatterRegex = /---\n[\s\S]*?\n---/;
  return content.replace(frontmatterRegex, '').trim();
}

// Function to get all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    // Get list of available post slugs - hardcoded for now
    // In a real app, you'd want to use a dynamic method to discover posts
    const availableSlugs = ['hello-world', 'cloudflare-tunnels-cli'];
    const posts: Post[] = [];
    
    // Process each post file
    for (const slug of availableSlugs) {
      try {
        const post = await getPostBySlug(slug);
        if (post) posts.push(post);
      } catch (error) {
        console.error(`Error processing post ${slug}:`, error);
      }
    }
    
    // Sort posts by date (newest first)
    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    try {
      // Fetch view counts for all posts in a single batch request
      const viewCounts = await preloadPostViews(sortedPosts.map(post => post.slug));
      
      // Add view counts to posts
      for (const post of sortedPosts) {
        post.views = viewCounts[post.slug] || 0;
      }
    } catch (error) {
      console.error('Error fetching post view counts:', error);
      // Continue without view counts if there's an error
    }
    
    return sortedPosts;
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

// Function to get a post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Fetch the post content
    const response = await fetch(`${contentDir}/${slug}.mdx`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post ${slug}: ${response.statusText}`);
    }
    
    const mdxContent = await response.text();
    const frontmatter = extractFrontmatter(mdxContent);
    const content = extractContent(mdxContent);
    
    // Create the post object
    const post: Post = {
      _id: slug,
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date || new Date().toISOString(),
      category: frontmatter.category as PostCategory || 'Blog',
      description: frontmatter.description || '',
      slug,
      url: `/posts/${slug}`,
      content
    };
    
    try {
      // Fetch view count for this post
      post.views = await getPostViews(slug);
    } catch (error) {
      console.error(`Error fetching view count for post ${slug}:`, error);
      // Set views to 0 if there's an error
      post.views = 0;
    }
    
    return post;
  } catch (error) {
    console.error(`Error getting post with slug ${slug}:`, error);
    return null;
  }
}