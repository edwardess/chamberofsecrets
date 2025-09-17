// This script seeds Firestore with the new groups and spaces data model
// It creates groups first, then spaces that reference those groups, and finally posts

const { initializeApp, getApps } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  writeBatch,
  serverTimestamp 
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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function seedNewModel() {
  try {
    console.log('Starting to seed Firestore with new data model...');
    
    // Step 1: Create groups
    console.log('Creating groups...');
    const groupsData = [
      { name: 'Support', order: 0 },
      { name: 'Product', order: 1 },
      { name: 'Billing', order: 2 }
    ];
    
    const groupIdMap = new Map();
    const groupsBatch = writeBatch(db);
    
    for (const groupData of groupsData) {
      const groupRef = doc(collection(db, 'groups'));
      groupsBatch.set(groupRef, {
        ...groupData,
        createdAt: serverTimestamp()
      });
      groupIdMap.set(groupData.name, groupRef.id);
      console.log(`✅ Created group "${groupData.name}" with ID: ${groupRef.id}`);
    }
    
    await groupsBatch.commit();
    console.log('🎉 All groups created successfully!');
    
    // Step 2: Create spaces
    console.log('\nCreating spaces...');
    const spacesData = [
      // Support group spaces
      { name: 'Getting Started', groupName: 'Support', order: 0 },
      { name: 'Account Management', groupName: 'Support', order: 1 },
      { name: 'Troubleshooting', groupName: 'Support', order: 2 },
      
      // Product group spaces
      { name: 'Features', groupName: 'Product', order: 0 },
      { name: 'Integrations', groupName: 'Product', order: 1 },
      { name: 'API Documentation', groupName: 'Product', order: 2 },
      
      // Billing group spaces
      { name: 'Plans & Pricing', groupName: 'Billing', order: 0 },
      { name: 'Payment Methods', groupName: 'Billing', order: 1 },
      { name: 'Invoices', groupName: 'Billing', order: 2 }
    ];
    
    const spaceIdMap = new Map();
    const spacesBatch = writeBatch(db);
    
    for (const spaceData of spacesData) {
      const groupId = groupIdMap.get(spaceData.groupName);
      if (!groupId) {
        console.error(`❌ Group "${spaceData.groupName}" not found for space "${spaceData.name}"`);
        continue;
      }
      
      const spaceRef = doc(collection(db, 'spaces'));
      spacesBatch.set(spaceRef, {
        name: spaceData.name,
        groupId: groupId,
        order: spaceData.order,
        createdAt: serverTimestamp()
      });
      spaceIdMap.set(spaceData.name, spaceRef.id);
      console.log(`✅ Created space "${spaceData.name}" in group "${spaceData.groupName}" with ID: ${spaceRef.id}`);
    }
    
    await spacesBatch.commit();
    console.log('🎉 All spaces created successfully!');
    
    // Step 3: Create posts
    console.log('\nCreating posts...');
    const postsData = [
      // Getting Started posts
      {
        title: 'How do I create an account?',
        spaceName: 'Getting Started',
        tags: ['account', 'signup', 'registration'],
        contentHTML: '<p>To create an account, follow these simple steps:</p><ol><li>Click the "Sign Up" button on our homepage</li><li>Enter your email address and choose a secure password</li><li>Verify your email address by clicking the link we send you</li><li>Complete your profile setup</li></ol><p>That\'s it! You\'re now ready to start using our platform.</p>',
        contentJSON: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'To create an account, follow these simple steps:' }] }] }
      },
      {
        title: 'What are the system requirements?',
        spaceName: 'Getting Started',
        tags: ['requirements', 'browser', 'compatibility'],
        contentHTML: '<p>Our platform works on most modern browsers and devices:</p><ul><li><strong>Browsers:</strong> Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</li><li><strong>Operating Systems:</strong> Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)</li><li><strong>Mobile:</strong> iOS 14+, Android 8+</li><li><strong>Internet:</strong> Stable broadband connection recommended</li></ul>',
        contentJSON: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Our platform works on most modern browsers and devices.' }] }] }
      },
      
      // Account Management posts
      {
        title: 'How do I change my password?',
        spaceName: 'Account Management',
        tags: ['password', 'security', 'account'],
        contentHTML: '<p>To change your password:</p><ol><li>Go to your Account Settings</li><li>Click on "Security" tab</li><li>Enter your current password</li><li>Enter your new password (twice for confirmation)</li><li>Click "Update Password"</li></ol><p><strong>Note:</strong> Your new password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.</p>',
        contentJSON: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'To change your password, follow these steps...' }] }] }
      },
      {
        title: 'How do I update my profile information?',
        spaceName: 'Account Management',
        tags: ['profile', 'settings', 'personal-info'],
        contentHTML: '<p>You can update your profile information at any time:</p><ol><li>Navigate to your Profile page</li><li>Click "Edit Profile"</li><li>Update the fields you want to change</li><li>Click "Save Changes"</li></ol><p>Changes are saved immediately and will be reflected across all our services.</p>',
        contentJSON: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'You can update your profile information at any time...' }] }] }
      },
      
      // Features posts
      {
        title: 'What features are available in the free plan?',
        spaceName: 'Features',
        tags: ['free-plan', 'features', 'limitations'],
        contentHTML: '<p>Our free plan includes:</p><ul><li>Up to 5 projects</li><li>Basic collaboration tools</li><li>1GB storage</li><li>Email support</li><li>Basic analytics</li></ul><p>For advanced features like unlimited projects, priority support, and advanced analytics, consider upgrading to our Pro plan.</p>',
        contentJSON: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Our free plan includes several useful features...' }] }] }
      },
      {
        title: 'How do I use the collaboration features?',
        spaceName: 'Features',
        tags: ['collaboration', 'team', 'sharing'],
        contentHTML: '<p>Our collaboration features help you work better with your team:</p><ol><li><strong>Invite team members:</strong> Send invitations via email</li><li><strong>Set permissions:</strong> Control who can view, edit, or manage projects</li><li><strong>Real-time editing:</strong> See changes as they happen</li><li><strong>Comments:</strong> Leave feedback and suggestions</li><li><strong>Version history:</strong> Track all changes over time</li></ol>',
        contentJSON: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Our collaboration features help you work better with your team...' }] }] }
      },
      
      // Billing posts
      {
        title: 'How do I upgrade my plan?',
        spaceName: 'Plans & Pricing',
        tags: ['upgrade', 'billing', 'plans'],
        contentHTML: '<p>To upgrade your plan:</p><ol><li>Go to your Billing page</li><li>Click "Upgrade Plan"</li><li>Select your desired plan</li><li>Enter your payment information</li><li>Confirm the upgrade</li></ol><p>Your new plan will be active immediately, and you\'ll be charged the prorated amount for the remaining billing period.</p>',
        contentJSON: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'To upgrade your plan, follow these steps...' }] }] }
      },
      {
        title: 'What payment methods do you accept?',
        spaceName: 'Payment Methods',
        tags: ['payment', 'credit-card', 'billing'],
        contentHTML: '<p>We accept the following payment methods:</p><ul><li>Credit cards (Visa, MasterCard, American Express)</li><li>Debit cards</li><li>PayPal</li><li>Bank transfers (for annual plans)</li><li>Cryptocurrency (Bitcoin, Ethereum)</li></ul><p>All payments are processed securely through our encrypted payment gateway.</p>',
        contentJSON: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'We accept various payment methods for your convenience...' }] }] }
      }
    ];
    
    const postsBatch = writeBatch(db);
    let postsCreated = 0;
    
    for (const postData of postsData) {
      const spaceId = spaceIdMap.get(postData.spaceName);
      if (!spaceId) {
        console.error(`❌ Space "${postData.spaceName}" not found for post "${postData.title}"`);
        continue;
      }
      
      const postRef = doc(collection(db, 'posts'));
      postsBatch.set(postRef, {
        title: postData.title,
        spaceId: spaceId,
        tags: postData.tags,
        contentHTML: postData.contentHTML,
        contentJSON: postData.contentJSON,
        createdAt: serverTimestamp()
      });
      postsCreated++;
      console.log(`✅ Created post "${postData.title}" in space "${postData.spaceName}"`);
    }
    
    await postsBatch.commit();
    console.log(`🎉 All ${postsCreated} posts created successfully!`);
    
    console.log('\n🎊 Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${groupsData.length} groups created`);
    console.log(`   - ${spacesData.length} spaces created`);
    console.log(`   - ${postsCreated} posts created`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

seedNewModel().then(() => {
  console.log('✅ Seeding script completed successfully!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Seeding script failed:', err);
  process.exit(1);
});













