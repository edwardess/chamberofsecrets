const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  updateDoc, 
  doc 
} = require('firebase/firestore');

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

// Tag suggestions for each category
const tagsByCategory = {
  "Getting Started": ["Account Creation", "Registration", "Setup", "Onboarding", "Basics"],
  "Billing": ["Payment Methods", "Pricing", "Subscription", "Invoices", "Refunds", "Credit Cards"],
  "Account Management": ["Password", "Profile", "Settings", "Security", "Email", "Recovery"]
};

// Function to get random tags from a category
function getRandomTags(category) {
  const availableTags = tagsByCategory[category] || [];
  if (availableTags.length === 0) return [];
  
  // Get 1-3 random tags
  const numTags = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...availableTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
}

async function updatePostsWithTags() {
  try {
    console.log('Starting to update posts with tags...');
    
    // Get all posts
    const querySnapshot = await getDocs(collection(db, 'posts'));
    
    // Update each post with tags
    for (const postDoc of querySnapshot.docs) {
      const postData = postDoc.data();
      const category = postData.category;
      
      // Skip if post already has tags
      if (postData.tags && Array.isArray(postData.tags) && postData.tags.length > 0) {
        console.log(`Post "${postData.title}" already has tags: ${postData.tags.join(', ')}`);
        continue;
      }
      
      // Generate random tags based on category
      const tags = getRandomTags(category);
      
      // Update the post
      await updateDoc(doc(db, 'posts', postDoc.id), { tags });
      
      console.log(`✅ Updated post "${postData.title}" with tags: ${tags.join(', ')}`);
    }
    
    console.log('🎉 Successfully updated posts with tags!');
  } catch (error) {
    console.error('❌ Error updating posts:', error);
  }
}

// Run the update function
updatePostsWithTags();













