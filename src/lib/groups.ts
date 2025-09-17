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
import { Group, CreateGroupData, UpdateGroupData, FirestoreDocumentData } from './types';

const GROUPS_COLLECTION = 'groups';

// Create a new group
export async function createGroup(groupData: CreateGroupData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
      ...groupData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

// Update an existing group
export async function updateGroup(groupId: string, groupData: UpdateGroupData): Promise<void> {
  try {
    const groupRef = doc(db, GROUPS_COLLECTION, groupId);
    await updateDoc(groupRef, groupData as FirestoreDocumentData);
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
}

// Delete a group
export async function deleteGroup(groupId: string): Promise<void> {
  try {
    const groupRef = doc(db, GROUPS_COLLECTION, groupId);
    await deleteDoc(groupRef);
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
}

// Get all groups
export async function getAllGroups(): Promise<Group[]> {
  try {
    const q = query(collection(db, GROUPS_COLLECTION), orderBy('order'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Group[];
  } catch (error) {
    console.error('Error getting groups:', error);
    throw error;
  }
}

// Get a single group by ID
export async function getGroupById(groupId: string): Promise<Group | null> {
  try {
    const groupRef = doc(db, GROUPS_COLLECTION, groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (groupSnap.exists()) {
      return {
        id: groupSnap.id,
        ...groupSnap.data()
      } as Group;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting group:', error);
    throw error;
  }
}













