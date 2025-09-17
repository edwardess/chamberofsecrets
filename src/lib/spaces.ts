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
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { Space, SpaceGroup, Group, CreateSpaceData, UpdateSpaceData, FirestoreDocumentData } from './types';
import { getAllGroups, getGroupById } from './groups';

const SPACES_COLLECTION = 'spaces';

// Create a new space
export async function createSpace(spaceData: CreateSpaceData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, SPACES_COLLECTION), {
      ...spaceData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating space:', error);
    throw error;
  }
}

// Update an existing space
export async function updateSpace(spaceId: string, spaceData: UpdateSpaceData): Promise<void> {
  try {
    const spaceRef = doc(db, SPACES_COLLECTION, spaceId);
    await updateDoc(spaceRef, spaceData as FirestoreDocumentData);
  } catch (error) {
    console.error('Error updating space:', error);
    throw error;
  }
}

// Delete a space
export async function deleteSpace(spaceId: string): Promise<void> {
  try {
    const spaceRef = doc(db, SPACES_COLLECTION, spaceId);
    await deleteDoc(spaceRef);
  } catch (error) {
    console.error('Error deleting space:', error);
    throw error;
  }
}

// Get all spaces
export async function getAllSpaces(): Promise<Space[]> {
  try {
    const q = query(collection(db, SPACES_COLLECTION), orderBy('groupId'), orderBy('order'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Space[];
  } catch (error) {
    console.error('Error getting spaces:', error);
    throw error;
  }
}

// Get spaces by groupId
export async function getSpacesByGroupId(groupId: string): Promise<Space[]> {
  try {
    const q = query(
      collection(db, SPACES_COLLECTION), 
      where('groupId', '==', groupId),
      orderBy('order')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Space[];
  } catch (error) {
    console.error('Error getting spaces by groupId:', error);
    throw error;
  }
}

// Get a single space by ID
export async function getSpaceById(spaceId: string): Promise<Space | null> {
  try {
    const spaceRef = doc(db, SPACES_COLLECTION, spaceId);
    const spaceSnap = await getDoc(spaceRef);
    
    if (spaceSnap.exists()) {
      return {
        id: spaceSnap.id,
        ...spaceSnap.data()
      } as Space;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting space:', error);
    throw error;
  }
}

// Get spaces organized by group
export async function getSpaceGroups(): Promise<SpaceGroup[]> {
  try {
    const groups = await getAllGroups();
    const spaces = await getAllSpaces();
    
    // Create SpaceGroup objects with spaces organized by groupId
    const spaceGroups: SpaceGroup[] = [];
    
    for (const group of groups) {
      const groupSpaces = spaces.filter(space => space.groupId === group.id);
      spaceGroups.push({
        id: group.id,
        name: group.name,
        spaces: groupSpaces.sort((a, b) => (a.order || 0) - (b.order || 0))
      });
    }
    
    return spaceGroups.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error getting space groups:', error);
    throw error;
  }
}
