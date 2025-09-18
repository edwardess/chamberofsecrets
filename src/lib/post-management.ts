import { 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { getPostsBySpace } from './posts';

const POSTS_COLLECTION = 'posts';

// Reassign posts from one space to another
export async function reassignPosts(fromSpaceId: string, toSpaceId: string): Promise<number> {
  try {
    const posts = await getPostsBySpace(fromSpaceId);
    
    if (posts.length === 0) {
      return 0;
    }
    
    const batch = writeBatch(db);
    
    posts.forEach(post => {
      const postRef = doc(db, POSTS_COLLECTION, post.id);
      batch.update(postRef, { spaceId: toSpaceId });
    });
    
    await batch.commit();
    return posts.length;
  } catch (error) {
    console.error('Error reassigning posts:', error);
    throw error;
  }
}

// Delete all posts in a space
export async function deletePostsBySpace(spaceId: string): Promise<number> {
  try {
    const posts = await getPostsBySpace(spaceId);
    
    if (posts.length === 0) {
      return 0;
    }
    
    const batch = writeBatch(db);
    
    posts.forEach(post => {
      const postRef = doc(db, POSTS_COLLECTION, post.id);
      batch.delete(postRef);
    });
    
    await batch.commit();
    return posts.length;
  } catch (error) {
    console.error('Error deleting posts by space:', error);
    throw error;
  }
}

// Delete all spaces in a group and their posts
export async function deleteSpacesAndPostsByGroup(groupId: string): Promise<{ spacesDeleted: number, postsDeleted: number }> {
  try {
    // Query all spaces in the group
    const spacesQuery = query(collection(db, 'spaces'), where('groupId', '==', groupId));
    const spacesSnapshot = await getDocs(spacesQuery);
    
    if (spacesSnapshot.empty) {
      return { spacesDeleted: 0, postsDeleted: 0 };
    }
    
    const batch = writeBatch(db);
    let totalPostsDeleted = 0;
    
    // For each space, get and delete its posts
    for (const spaceDoc of spacesSnapshot.docs) {
      const spaceId = spaceDoc.id;
      
      // Get posts in this space
      const postsQuery = query(collection(db, POSTS_COLLECTION), where('spaceId', '==', spaceId));
      const postsSnapshot = await getDocs(postsQuery);
      
      // Delete all posts in this space
      postsSnapshot.forEach(postDoc => {
        batch.delete(postDoc.ref);
        totalPostsDeleted++;
      });
      
      // Delete the space itself
      batch.delete(spaceDoc.ref);
    }
    
    await batch.commit();
    return { 
      spacesDeleted: spacesSnapshot.size,
      postsDeleted: totalPostsDeleted
    };
  } catch (error) {
    console.error('Error deleting spaces and posts by group:', error);
    throw error;
  }
}

// Reassign all spaces in a group to another group
export async function reassignSpacesToGroup(fromGroupId: string, toGroupId: string): Promise<number> {
  try {
    // Query all spaces in the source group
    const spacesQuery = query(collection(db, 'spaces'), where('groupId', '==', fromGroupId));
    const spacesSnapshot = await getDocs(spacesQuery);
    
    if (spacesSnapshot.empty) {
      return 0;
    }
    
    const batch = writeBatch(db);
    
    // Update each space to the new group
    spacesSnapshot.forEach(spaceDoc => {
      batch.update(spaceDoc.ref, { groupId: toGroupId });
    });
    
    await batch.commit();
    return spacesSnapshot.size;
  } catch (error) {
    console.error('Error reassigning spaces to group:', error);
    throw error;
  }
}














