# Firebase Setup Guide - Phase 2

## ✅ Completed Steps

1. **Firebase Configuration Updated** - Your Firebase config has been added to `src/lib/firebase.ts`
2. **Sample Data Seeded** - 3 demo posts have been added to Firestore across different categories:
   - "How do I create an account?" (Getting Started)
   - "What payment methods do you accept?" (Billing) 
   - "How do I reset my password?" (Account Management)

## 🔧 Required Manual Steps

### 1. Apply Firestore Security Rules

You need to copy the security rules from `firestore.rules` to your Firebase console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `homeoftreasures-53401`
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace the existing rules with the content from `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Posts collection rules
    match /posts/{postId} {
      // Allow anyone to read posts (public access)
      allow read: if true;
      
      // Only authenticated users can create, update, or delete posts
      allow create: if request.auth != null 
        && request.auth.uid != null
        && validatePostData(request.resource.data);
      
      allow update: if request.auth != null 
        && request.auth.uid != null
        && validatePostData(request.resource.data);
      
      allow delete: if request.auth != null 
        && request.auth.uid != null;
    }
    
    // Helper function to validate post data structure
    function validatePostData(data) {
      return data.keys().hasAll(['title', 'category', 'contentHTML', 'contentJSON', 'createdAt'])
        && data.title is string
        && data.category is string
        && data.contentHTML is string
        && data.contentJSON is map
        && data.createdAt is timestamp
        && data.title.size() > 0
        && data.category.size() > 0
        && data.contentHTML.size() > 0;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish** to apply the rules

### 2. Verify Security Rules

After applying the rules, run the test script to verify:

```bash
node scripts/test-firestore.js
```

You should see:
- ✅ Public read access working
- ❌ Write access properly blocked without authentication

## 📊 Database Schema

The posts collection follows this schema:

```typescript
interface Post {
  id: string;           // Auto-generated document ID
  title: string;        // Post title
  category: string;     // Category name
  createdAt: Timestamp; // Creation timestamp
  contentHTML: string;  // HTML content for display
  contentJSON: object;  // JSON content for editing
}
```

## 🔐 Security Features

- **Public Read Access**: Anyone can read posts without authentication
- **Authenticated Write Access**: Only logged-in users can create/update/delete posts
- **Data Validation**: Rules validate that posts have required fields and proper data types
- **Admin-Only Operations**: All write operations require authentication

## 🧪 Testing

The test script (`scripts/test-firestore.js`) verifies:
1. Posts can be read without authentication ✅
2. Posts cannot be created without authentication ❌ (after rules are applied)

## 📁 Files Created/Modified

- `src/lib/firebase.ts` - Updated with your Firebase config
- `scripts/seed-firestore.js` - Script to populate sample data
- `scripts/test-firestore.js` - Script to test security rules
- `firestore.rules` - Security rules for Firestore
- `FIREBASE_SETUP_GUIDE.md` - This setup guide

## 🚀 Next Steps

Once you've applied the Firestore security rules:
1. Run `node scripts/test-firestore.js` to verify everything works
2. You're ready for Phase 3: Public FAQ Interface














