// This script migrates the existing space data model to the new groups-based model
// It creates a 'groups' collection based on unique group names in spaces
// Then updates all spaces to use groupId instead of group name

const { initializeApp, getApps } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc,
  query,
  where,
  writeBatch,
  serverTimestamp 
} = require('firebase/firestore');

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyA6zEKkoTfis02VQWtyUwJYr0igDEmIqto",
  authDomain: "homeoftreasures-53401.firebaseapp.com",
  projectId: "homeoftreasures-53401",
  storageBucket: "homeoftreasures-53401.firebasestorage.app",
  messagingSenderId: "321596479074",
  appId: "1:321596479074:web:79342d80f8dbacb797e33b",
  measurementId: "G-WZCTQB56VB"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function migrateToGroups() {
  try {
    console.log('Starting migration to groups-based model...');
    
    // Step 1: Get all spaces
    const spacesQuery = query(collection(db, 'spaces'));
    const spacesSnapshot = await getDocs(spacesQuery);
    
    if (spacesSnapshot.empty) {
      console.log('No spaces found to migrate.');
      return;
    }
    
    console.log(`Found ${spacesSnapshot.size} spaces to migrate.`);
    
    // Step 2: Extract unique group names
    const groupNames = new Set();
    spacesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.group) {
        groupNames.add(data.group);
      }
    });
    
    if (groupNames.size === 0) {
      console.log('No groups found in spaces.');
      return;
    }
    
    console.log(`Found ${groupNames.size} unique groups: ${Array.from(groupNames).join(', ')}`);
    
    // Step 3: Create groups collection
    const groupIdMap = new Map(); // Map group names to their IDs
    const batch = writeBatch(db);
    
    let groupOrder = 0;
    for (const groupName of groupNames) {
      // Create a new group document
      const groupDocRef = doc(collection(db, 'groups'));
      batch.set(groupDocRef, {
        name: groupName,
        order: groupOrder++,
        createdAt: serverTimestamp()
      });
      
      groupIdMap.set(groupName, groupDocRef.id);
      console.log(`Created group "${groupName}" with ID: ${groupDocRef.id}`);
    }
    
    // Commit the batch to create all groups
    await batch.commit();
    console.log('All groups created successfully.');
    
    // Step 4: Update spaces to use groupId instead of group name
    const updateBatch = writeBatch(db);
    let updatedCount = 0;
    
    spacesSnapshot.forEach(spaceDoc => {
      const spaceData = spaceDoc.data();
      const groupName = spaceData.group;
      
      if (groupName && groupIdMap.has(groupName)) {
        const groupId = groupIdMap.get(groupName);
        
        // Update space to use groupId and remove group field
        updateBatch.update(spaceDoc.ref, {
          groupId: groupId,
          group: null // Set to null to keep a record of the change
        });
        
        updatedCount++;
      }
    });
    
    // Commit the batch to update all spaces
    await updateBatch.commit();
    console.log(`Updated ${updatedCount} spaces with groupId references.`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateToGroups().then(() => {
  console.log('Migration script finished.');
  process.exit(0);
}).catch(err => {
  console.error('Migration script failed:', err);
  process.exit(1);
});














