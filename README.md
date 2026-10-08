# SRS Demo Restaurant — Owner Food + Online Orders

This version adds:
- Owner menu management
- Add food manually
- Food name/category/price/description
- Upload food photos to Firebase Storage
- Food photo URL saved in Realtime Database
- Online-order-ready menu
- Owner can manually create orders
- Orders show food photo, customer, phone, quantity, source, total and status
- Dashboard Menu and Orders buttons open the live Firebase modules

Firebase setup:
1. Enable Authentication → Email/Password.
2. Enable Realtime Database.
3. Enable Firebase Storage.
4. Put the exact Firebase web config in `js/firebase-config.js`.
5. Publish the Realtime Database rules from `firebase/database-rules.json`.
6. Apply the Storage rules from `firebase/storage.rules`.

Important:
- The included Storage rule is suitable for this prototype but allows any authenticated account to upload an image. For production, use Firebase custom claims or a trusted backend so only owner-role accounts can upload/delete menu photos.
- Client-side role hiding is not security; Database Rules protect financial paths.
- Online ordering can be connected to a public customer website later: the customer submits an order to `orders/`, while the owner/staff dashboard receives it in real time.


## Dashboard redesign
The dashboard has been redesigned to closely follow the supplied 1st reference:
- dark restaurant-management UI
- yellow/gold active navigation
- restaurant hero banner
- search/header/profile area
- five KPI cards
- owner-only revenue KPI/chart
- order-type donut
- live orders
- table map
- recent activity
- quick actions
- responsive mobile bottom navigation

The existing Firebase login, owner/staff permissions, menu photo upload and online/manual order modules are preserved.
