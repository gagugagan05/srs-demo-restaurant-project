# SRS Demo Restaurant

## GitHub Pages entry point
`index.html` is the restaurant login page. GitHub Pages uses `index.html` at the top level of the publishing source, so opening the site root starts directly at login instead of rendering the repository README.

## Firebase setup
1. Enable Authentication → Email/Password.
2. Enable Realtime Database.
3. Enable Firebase Storage.
4. Put the exact Firebase web config in `js/firebase-config.js`.
5. Publish the Realtime Database rules from `firebase/database-rules.json`.
6. Apply the Storage rules from `firebase/storage.rules`.
7. Create owner/staff users in Firebase Authentication and add matching `/users/{uid}` records with `role: owner` or `role: staff`.

## GitHub Pages
Upload the **contents of this ZIP** to the repository's publishing source so that `index.html` is directly at the root (not inside another folder).

Recommended Pages setting:
- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

After pushing, GitHub Pages may take several minutes to publish the update.
