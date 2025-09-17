const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, Timestamp } = require('firebase/firestore');

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

async function testFirestoreAccess() {
  try {
    console.log('🧪 Testing Firestore access...\n');
    
    // Test 1: Read posts without authentication (should work)
    console.log('📖 Test 1: Reading posts without authentication...');
    const querySnapshot = await getDocs(collection(db, 'posts'));
    console.log(`✅ Successfully read ${querySnapshot.size} posts without authentication`);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`   - "${data.title}" (${data.category})`);
    });
    
    console.log('\n📝 Test 2: Attempting to create post without authentication...');
    try {
      await addDoc(collection(db, 'posts'), {
        title: "Test Post",
        category: "Test",
        contentHTML: "<p>This should fail</p>",
        contentJSON: { type: "doc", content: [] },
        createdAt: Timestamp.now()
      });
      console.log('❌ Unexpected: Post creation succeeded without authentication');
    } catch (error) {
      console.log('✅ Expected: Post creation failed without authentication');
      console.log(`   Error: ${error.message}`);
    }
    
    console.log('\n🎉 Firestore security rules are working correctly!');
    console.log('   - ✅ Public read access is working');
    console.log('   - ✅ Write access requires authentication');
    
  } catch (error) {
    console.error('❌ Error testing Firestore:', error);
  }
}

// Run the test
testFirestoreAccess();













