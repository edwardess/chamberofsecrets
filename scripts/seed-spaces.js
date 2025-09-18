const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, updateDoc } = require('firebase/firestore');

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample spaces data
const sampleSpaces = [
  // Support group
  {
    name: "Account Management",
    group: "Support",
    order: 1
  },
  {
    name: "Billing",
    group: "Support",
    order: 2
  },
  {
    name: "Getting Started",
    group: "Support",
    order: 3
  },
  
  // Product group
  {
    name: "Features",
    group: "Product",
    order: 1
  },
  {
    name: "Integrations",
    group: "Product",
    order: 2
  },
  {
    name: "Roadmap",
    group: "Product",
    order: 3
  }
];

// Space ID mapping to update posts
const spaceIdMap = {};

async function seedSpaces() {
  try {
    console.log('Starting to seed spaces collection...');
    
    // Add spaces
    for (const space of sampleSpaces) {
      const docRef = await addDoc(collection(db, 'spaces'), space);
      console.log(`✅ Added space "${space.name}" in group "${space.group}" with ID: ${docRef.id}`);
      
      // Store the mapping from space name to ID for updating posts
      spaceIdMap[space.name] = docRef.id;
    }
    
    console.log('🎉 Successfully seeded spaces collection!');
    return spaceIdMap;
  } catch (error) {
    console.error('❌ Error seeding spaces:', error);
    throw error;
  }
}

async function updatePostsWithSpaceIds(spaceIdMap) {
  try {
    console.log('\nUpdating posts with space IDs...');
    
    // Get all posts
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    
    // Update each post
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      const category = postData.category;
      
      // Check if we have a space ID for this category
      if (spaceIdMap[category]) {
        // Update the post with spaceId
        await updateDoc(doc(db, 'posts', postDoc.id), {
          spaceId: spaceIdMap[category]
        });
        console.log(`✅ Updated post "${postData.title}" with spaceId: ${spaceIdMap[category]}`);
      } else {
        console.warn(`⚠️ No space found for category "${category}" in post "${postData.title}"`);
      }
    }
    
    console.log('🎉 Successfully updated posts with space IDs!');
  } catch (error) {
    console.error('❌ Error updating posts:', error);
  }
}

// Run the seed function and then update posts
async function run() {
  try {
    const spaceIdMap = await seedSpaces();
    await updatePostsWithSpaceIds(spaceIdMap);
  } catch (error) {
    console.error('Failed to complete seeding process:', error);
  }
}

run();














