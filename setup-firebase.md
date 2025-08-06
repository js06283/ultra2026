# Firebase Setup Guide for Festival Planner

This guide will walk you through setting up Firebase for your festival planner application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "festival-planner")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project dashboard, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location close to your users (e.g., "us-central1" for US users)
5. Click "Done"

## Step 3: Get Your Web App Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "festival-planner-web")
6. Click "Register app"
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
	apiKey: "AIzaSyC...",
	authDomain: "your-project.firebaseapp.com",
	projectId: "your-project",
	storageBucket: "your-project.appspot.com",
	messagingSenderId: "123456789",
	appId: "1:123456789:web:abcdef123456",
};
```

## Step 4: Update Your Configuration

1. Open the `firebase-config.js` file in your project
2. Replace the placeholder configuration with your actual configuration:

```javascript
// Replace this:
const firebaseConfig = {
	apiKey: "your-api-key",
	authDomain: "your-project-id.firebaseapp.com",
	projectId: "your-project-id",
	storageBucket: "your-project-id.appspot.com",
	messagingSenderId: "your-messaging-sender-id",
	appId: "your-app-id",
};

// With your actual configuration from Step 3
```

## Step 5: Test Your Setup

1. Open `index.html` in your browser
2. Open the browser's developer tools (F12)
3. Check the console for any Firebase-related errors
4. Try adding yourself to a show
5. Check the Firebase console to see if data is being saved

## Step 6: Set Up Security Rules (Optional but Recommended)

1. In your Firebase project, go to "Firestore Database"
2. Click the "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /attendees/{document} {
      allow read, write: if true; // Allow all access for now
    }
  }
}
```

4. Click "Publish"

## Troubleshooting

### Common Issues

1. **"Firebase not available" warning**:

   - Make sure you've updated the `firebase-config.js` file with your actual configuration
   - Check that the Firebase SDK is loading properly

2. **"Permission denied" errors**:

   - Make sure you've set up the security rules correctly
   - Ensure you're in "test mode" or have proper authentication set up

3. **Data not syncing**:
   - Check your internet connection
   - Verify that Firestore is enabled in your Firebase project
   - Check the browser console for error messages

### Testing Real-time Features

1. Open the application in two different browser windows
2. Add yourself to a show in one window
3. You should see the change appear in the other window within a few seconds

## Next Steps

Once Firebase is set up, your festival planner will have:

- ✅ Real-time data synchronization across multiple users
- ✅ Cloud-based data storage
- ✅ Automatic offline support
- ✅ Cross-device synchronization

## Security Considerations

For production use, consider:

1. **Authentication**: Implement user authentication to control access
2. **Security Rules**: Set up proper Firestore security rules
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Data Validation**: Add server-side validation for data integrity

## Support

If you're still having issues:

1. Check the [Firebase documentation](https://firebase.google.com/docs)
2. Look at the browser console for specific error messages
3. Verify your Firebase project settings
4. Ensure you're using the latest version of the Firebase SDK
