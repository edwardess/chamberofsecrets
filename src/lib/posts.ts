import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
  increment,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, CreatePostData, UpdatePostData, FirestoreDocumentData } from './types';

const POSTS_COLLECTION = 'posts';

// Create a new post
export async function createPost(postData: CreatePostData): Promise<string> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    // Check the size of the content to make sure it doesn't exceed Firestore limits
    // Firestore has a document size limit of 1MB
    const contentSize = new TextEncoder().encode(JSON.stringify(postData)).length;
    const maxSize = 900 * 1024; // 900KB to be safe (Firestore limit is 1MB)
    
    if (contentSize > maxSize) {
      throw new Error(`Content size (${Math.round(contentSize/1024)}KB) exceeds Firestore's limit (${Math.round(maxSize/1024)}KB)`);
    }
    
    // Ensure hearts field is initialized to 0 if not provided
    const postWithDefaults = {
      ...postData,
      hearts: postData.hearts ?? 0, // Default to 0 if not provided
    };
    
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postWithDefaults,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Update an existing post
export async function updatePost(postId: string, postData: UpdatePostData): Promise<void> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    // Check the size of the content to make sure it doesn't exceed Firestore limits
    const contentSize = new TextEncoder().encode(JSON.stringify(postData)).length;
    const maxSize = 900 * 1024; // 900KB to be safe (Firestore limit is 1MB)
    
    if (contentSize > maxSize) {
      throw new Error(`Content size (${Math.round(contentSize/1024)}KB) exceeds Firestore's limit (${Math.round(maxSize/1024)}KB)`);
    }
    
    const postRef = doc(db, POSTS_COLLECTION, postId);
    // Add updatedAt timestamp to track when the post was last modified
    await updateDoc(postRef, {
      ...postData,
      updatedAt: Timestamp.now()
    } as FirestoreDocumentData);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Delete a post
export async function deletePost(postId: string): Promise<void> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        hearts: data.hearts || 0, // Ensure hearts exists with default 0
        // Make sure contentHTML exists even if somehow missing
        contentHTML: data.contentHTML || ''
      };
    }) as Post[];
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
}

// Get posts by space ID
export async function getPostsBySpace(spaceId: string): Promise<Post[]> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const q = query(
      collection(db, POSTS_COLLECTION), 
      where('spaceId', '==', spaceId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        hearts: data.hearts || 0, // Ensure hearts exists with default 0
        // Make sure contentHTML exists even if somehow missing
        contentHTML: data.contentHTML || ''
      };
    }) as Post[];
  } catch (error) {
    console.error('Error getting posts by space:', error);
    throw error;
  }
}

// Get a single post by ID
export async function getPostById(postId: string): Promise<Post | null> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const data = postSnap.data();
      return {
        id: postSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        hearts: data.hearts || 0, // Ensure hearts exists with default 0
        // Make sure contentHTML exists even if somehow missing
        contentHTML: data.contentHTML || ''
      } as Post;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
}

// Get unique tags from posts in a specific space
export async function getTagsBySpace(spaceId: string): Promise<string[]> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const posts = await getPostsBySpace(spaceId);
    // Flatten all tags arrays and get unique values
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = [...new Set(allTags)].filter(tag => tag && tag.trim() !== '');
    return uniqueTags.sort();
  } catch (error) {
    console.error('Error getting tags by space:', error);
    throw error;
  }
}

// Increment hearts count for a post
export async function incrementHearts(postId: string): Promise<void> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      hearts: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing hearts:', error);
    throw error;
  }
}