// This script seeds Firestore with new data model based on the screenshot
// It creates groups first, then spaces that reference those groups, and finally posts for "Pricing + Scope"

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

async function seedNewFaqData() {
  try {
    console.log('Starting to seed Firestore with new data model based on screenshot...');
    
    // Step 1: Create groups
    console.log('Creating groups...');
    const groupsData = [
      { name: 'THE DOWNLOAD', order: 0 },
      { name: 'FILING CABINET', order: 1 }
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
      // THE DOWNLOAD spaces
      { name: 'Top Shelf', groupName: 'THE DOWNLOAD', order: 0 },
      { name: 'Weekly Updates', groupName: 'THE DOWNLOAD', order: 1 },
      { name: 'Talk Shop', groupName: 'THE DOWNLOAD', order: 2 },
      
      // FILING CABINET spaces
      { name: 'Getting Clients', groupName: 'FILING CABINET', order: 0 },
      { name: 'Pricing + Scope', groupName: 'FILING CABINET', order: 1 },
      { name: 'Client Management', groupName: 'FILING CABINET', order: 2 },
      { name: 'Content Strategy', groupName: 'FILING CABINET', order: 3 },
      { name: 'Content Creation', groupName: 'FILING CABINET', order: 4 },
      { name: 'Workflow + Systems', groupName: 'FILING CABINET', order: 5 },
      { name: 'Business Growth', groupName: 'FILING CABINET', order: 6 }
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
    
    // Step 3: Create posts (only for Pricing + Scope)
    console.log('\nCreating posts for Pricing + Scope...');
    const postsData = [
      // Pricing + Scope posts based on screenshot
      {
        title: 'How to Decide What Services to Offer as a Social Media Manager (Without the Overwhelm)',
        spaceName: 'Pricing + Scope',
        tags: ['services', 'social media', 'packages'],
        contentHTML: '<h2>Deciding on Your Service Offerings</h2><p>As a social media manager, figuring out what services to offer can feel overwhelming. Here is a structured approach:</p><ul><li>Assess your strongest skills</li><li>Research market demand</li><li>Start with core services</li><li>Create tiered packages</li><li>Adjust based on client feedback</li></ul><p>Remember that you can always evolve your offerings as you grow.</p>',
      },
      {
        title: '15 Social Media Manager Packages That Aren\'t Full Management',
        spaceName: 'Pricing + Scope',
        tags: ['packages', 'services', 'pricing'],
        contentHTML: '<h2>Alternative Package Ideas</h2><p>Not every client needs full social media management. Here are alternative packages you can offer:</p><ol><li>Content calendar creation</li><li>Strategy sessions</li><li>Platform audits</li><li>Analytics reports</li><li>Caption writing packages</li><li>Hashtag research</li><li>Profile optimization</li><li>Content creation (no posting)</li><li>Team training</li><li>1:1 coaching</li><li>Platform setup</li><li>Engagement-only packages</li><li>Consultation calls</li><li>Content templates</li><li>Social media playbooks</li></ol>',
      },
      {
        title: 'The Price Increase That Nearly Broke Me (And Why It Was the Best Thing for My Business)',
        spaceName: 'Pricing + Scope',
        tags: ['pricing', 'rates', 'business growth'],
        contentHTML: '<h2>My Price Increase Journey</h2><p>Raising my prices was one of the hardest decisions I made, but ultimately the most important for my business sustainability.</p><h3>Why I needed to increase prices:</h3><ul><li>Working too many hours</li><li>Undervaluing my expertise</li><li>Hitting income ceiling</li><li>Burnout was imminent</li></ul><h3>The results:</h3><p>After increasing prices by 30%, I lost two clients but gained three higher-quality ones. My income increased while I worked fewer hours, and client results improved because I had more time to focus.</p>',
      },
      {
        title: 'What High-Paying Clients Actually Expect (And How to Know If You\'re Ready)',
        spaceName: 'Pricing + Scope',
        tags: ['clients', 'pricing', 'professionalism'],
        contentHTML: '<h2>Premium Client Expectations</h2><p>High-paying clients have different expectations than budget clients. Here\'s what they typically look for:</p><ul><li>Exceptional communication</li><li>Strategic thinking, not just execution</li><li>Proactive problem solving</li><li>Professional processes</li><li>Results and ROI focus</li><li>Expertise and confidence</li></ul><h3>Signs you\'re ready for premium clients:</h3><p>You have documented processes, can show tangible results, communicate clearly, set proper boundaries, and have developed a distinctive approach to your services.</p>',
      },
      {
        title: 'How to Talk About Your Prices Without Feeling Awkward',
        spaceName: 'Pricing + Scope',
        tags: ['pricing', 'sales', 'confidence'],
        contentHTML: '<h2>Confident Price Conversations</h2><p>Many service providers struggle with pricing conversations. Here\'s how to handle them confidently:</p><ol><li>Know your value proposition inside and out</li><li>Practice saying your prices out loud</li><li>Focus on outcomes, not hours</li><li>Prepare for objections in advance</li><li>Use a consistent pricing structure</li><li>Never apologize for your rates</li></ol><h3>Sample script:</h3><p>"My [service] package is $X. This includes [deliverables] which typically helps clients achieve [specific outcome]. Based on what you\'ve shared, this would be the best option to help you reach your goals of [client\'s stated goals]."</p>',
      },
      {
        title: 'How to Add New Services to Existing Client Packages',
        spaceName: 'Pricing + Scope',
        tags: ['services', 'upselling', 'client management'],
        contentHTML: '<h2>Expanding Client Services</h2><p>Adding new services to existing client packages can increase your revenue and provide more value. Here\'s how to do it effectively:</p><h3>Step-by-step approach:</h3><ol><li>Identify gaps in current service</li><li>Develop the new offering</li><li>Present benefits, not features</li><li>Start with a trial offer</li><li>Create tiered options</li><li>Time it right (contract renewals are ideal)</li></ol><h3>Common mistakes to avoid:</h3><p>Don\'t surprise clients with sudden price increases, don\'t offer services you can\'t deliver consistently, and avoid assuming clients know why they need the additional service.</p>'
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

seedNewFaqData().then(() => {
  console.log('✅ Seeding script completed successfully!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Seeding script failed:', err);
  process.exit(1);
});
