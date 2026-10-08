# SRS Demo Restaurant — Complete Firebase Setup & Login Credentials

This is the single setup file for the SRS Demo Restaurant Firebase system.

It contains:
- Firebase Web App configuration
- Owner login setup
- Staff login setup
- Owner/staff roles
- Realtime Database structure
- Security rules
- Menu + food photo storage structure
- Online/manual orders
- Attendance
- Owner-only financial data
- Production security checklist
- Manual credential template

---

# 1. Firebase Project

Firebase project:

```text
Project ID: srs-vision
```

Firebase Web App configuration currently used by the project:

```js
const firebaseConfig = {
  apiKey: "AIzaSyDwhKcy-3AzZcotOTwA7v6_BnssVbFB0hY",
  authDomain: "srs-vision.firebaseapp.com",
  projectId: "srs-vision",
  storageBucket: "srs-vision.firebasestorage.app",
  messagingSenderId: "627605481113",
  appId: "1:e145ebab48e93e97bfba08",
  measurementId: "G-TZFLP5YFQ0"
};
```

IMPORTANT:
- The Firebase Web API key is not a password.
- NEVER put an Owner password or Staff password in HTML/JavaScript.
- NEVER store passwords inside Realtime Database.
- Firebase Authentication stores/manages passwords.

---

# 2. Enable Firebase Authentication

Firebase Console:

```text
Authentication
→ Sign-in method
→ Email/Password
→ Enable
```

Create users manually:

```text
Authentication
→ Users
→ Add user
```

Example Owner:

```text
Email: owner@yourrestaurant.com
Password: CREATE-YOUR-OWN-STRONG-PASSWORD
```

Example Staff:

```text
Email: staff1@yourrestaurant.com
Password: CREATE-YOUR-OWN-STRONG-PASSWORD
```

Do NOT use these example passwords in production.

---

# 3. Role System

The application uses:

```text
owner
staff
```

Owner:
- Dashboard
- Orders
- Tables
- Reservations
- Customers
- Menu
- Inventory
- Expenses
- Revenue
- Reports
- Staff
- Attendance
- Equipment
- Settings

Staff:
- Dashboard
- Orders
- Tables
- Reservations
- Customers
- Menu
- Inventory
- Staff
- Attendance
- Equipment
- Settings

Staff MUST NOT access:

```text
expenses
revenue
reports
```

Financial protection must be enforced by Firebase Security Rules, not just by hiding buttons.

---

# 4. Add User Role Profiles

After creating a user in Firebase Authentication, copy that user's UID.

Example:

```text
OWNER_UID_HERE
STAFF_UID_HERE
```

Realtime Database:

```text
users/
  OWNER_UID_HERE/
    name: "Restaurant Owner"
    role: "owner"
    email: "owner@yourrestaurant.com"
    active: true

  STAFF_UID_HERE/
    name: "Staff Member 1"
    role: "staff"
    email: "staff1@yourrestaurant.com"
    active: true
```

Do not put passwords here.

---

# 5. Recommended Owner Profile

```json
{
  "name": "Restaurant Owner",
  "role": "owner",
  "email": "owner@yourrestaurant.com",
  "active": true,
  "permissions": {
    "dashboard": true,
    "orders": true,
    "tables": true,
    "reservations": true,
    "customers": true,
    "menu": true,
    "inventory": true,
    "expenses": true,
    "revenue": true,
    "reports": true,
    "staff": true,
    "attendance": true,
    "equipment": true,
    "settings": true
  }
}
```

---

# 6. Recommended Staff Profile

```json
{
  "name": "Staff Member 1",
  "role": "staff",
  "email": "staff1@yourrestaurant.com",
  "active": true,
  "permissions": {
    "dashboard": true,
    "orders": true,
    "tables": true,
    "reservations": true,
    "customers": true,
    "menu": true,
    "inventory": true,
    "expenses": false,
    "revenue": false,
    "reports": false,
    "staff": true,
    "attendance": true,
    "equipment": true,
    "settings": true
  }
}
```

For stronger production security, the Firebase rules should remain the final authority.

---

# 7. Realtime Database Structure

Use this structure:

```text
/
├── users/
│   └── {uid}/
│
├── restaurant/
│   ├── profile/
│   ├── settings/
│   └── branding/
│
├── orders/
│   └── {orderId}/
│
├── tables/
│   └── {tableId}/
│
├── reservations/
│   └── {reservationId}/
│
├── customers/
│   └── {customerId}/
│
├── menu/
│   └── {foodId}/
│
├── inventory/
│   └── {itemId}/
│
├── staff/
│   └── {staffId}/
│
├── attendance/
│   └── {staffId}/
│       └── {attendanceId}/
│
├── equipment/
│   └── {equipmentId}/
│
├── expenses/
│   └── {expenseId}/
│
├── revenue/
│   └── {revenueId}/
│
├── reports/
│   └── {reportId}/
│
└── notifications/
    └── {notificationId}/
```

---

# 8. Menu / Food Data

Example:

```json
{
  "name": "Paneer Butter Masala",
  "category": "Main Course",
  "price": 220,
  "description": "Creamy tomato-based paneer curry",
  "available": true,
  "photoUrl": "FIREBASE_STORAGE_URL",
  "createdAt": 1760000000000,
  "createdBy": "OWNER_UID"
}
```

Owner can manually add:

```text
Food name
Category
Price
Description
Food photo
Online availability
```

---

# 9. Firebase Storage

Create/use Firebase Storage.

Recommended path:

```text
menu/
  {foodId}/
    food-photo.jpg
```

Example:

```text
menu/food001/paneer-butter-masala.jpg
```

Photos should be:
- image files only
- maximum 5 MB
- preferably JPG/WebP/PNG

For production, only Owner should be able to upload/delete menu images.

---

# 10. Orders

Example order:

```json
{
  "customerName": "Ramesh",
  "phone": "+91XXXXXXXXXX",
  "itemId": "food001",
  "quantity": 2,
  "total": 440,
  "status": "New",
  "source": "Online",
  "createdAt": 1760000000000
}
```

Possible order sources:

```text
Online
Phone
Walk-in
WhatsApp
```

Possible statuses:

```text
New
Accepted
Preparing
Ready
Served
Completed
Cancelled
Rejected
```

---

# 11. Tables

Example:

```json
{
  "name": "T04",
  "capacity": 4,
  "status": "occupied"
}
```

Statuses:

```text
available
occupied
reserved
cleaning
```

---

# 12. Reservations

Example:

```json
{
  "customerName": "Ramesh",
  "phone": "+91XXXXXXXXXX",
  "date": "2026-10-08",
  "time": "19:30",
  "guests": 4,
  "tableId": "T04",
  "status": "confirmed"
}
```

---

# 13. Customers

Example:

```json
{
  "name": "Ramesh",
  "phone": "+91XXXXXXXXXX",
  "email": "customer@example.com",
  "totalOrders": 4,
  "createdAt": 1760000000000
}
```

---

# 14. Inventory

Example:

```json
{
  "name": "Paneer",
  "unit": "kg",
  "quantity": 15,
  "minimumQuantity": 5,
  "status": "in_stock"
}
```

---

# 15. Staff

Example:

```json
{
  "name": "Rahul Kumar",
  "role": "Waiter",
  "phone": "+91XXXXXXXXXX",
  "email": "staff1@yourrestaurant.com",
  "active": true
}
```

IMPORTANT:
The `staff` database record is NOT the authentication password.

Authentication credentials belong in Firebase Authentication.

---

# 16. Attendance

Recommended:

```text
attendance/
  STAFF_UID/
    ATTENDANCE_ID/
```

Example:

```json
{
  "date": "2026-10-08",
  "checkIn": "09:02",
  "checkOut": "18:10",
  "status": "present"
}
```

Production rule recommendation:

```text
Staff → can create/update their own attendance
Owner → can read/manage all attendance
Staff → cannot edit another staff member's attendance
```

---

# 17. Owner-Only Financial Data

Expenses:

```text
expenses/
```

Revenue:

```text
revenue/
```

Reports:

```text
reports/
```

Only:

```text
role == owner
```

should be allowed to read/write these paths.

Staff must receive a Firebase permission denial if they try to access them directly.

---

# 18. Starter Realtime Database Security Rules

Paste into:

```text
Firebase Console
→ Realtime Database
→ Rules
```

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'owner')",
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'"
      }
    },

    "restaurant": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'"
    },

    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "tables": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "reservations": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "customers": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "menu": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "inventory": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "staff": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'"
    },

    "attendance": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "equipment": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "expenses": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'"
    },

    "revenue": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'"
    },

    "reports": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'owner'"
    },

    "notifications": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

NOTE:
These are starter rules. Before a real restaurant goes live, make permissions more granular so staff cannot modify fields they should only read.

---

# 19. Login Credential Sheet

Fill this section manually.

## OWNER

```text
Owner Name:
________________________________

Owner Email:
________________________________

Owner Firebase UID:
________________________________

Owner Password:
________________________________

Owner Phone:
________________________________

Role:
owner
```

## STAFF 01

```text
Name:
________________________________

Email:
________________________________

Firebase UID:
________________________________

Password:
________________________________

Phone:
________________________________

Role:
staff
```

## STAFF 02

```text
Name:
________________________________

Email:
________________________________

Firebase UID:
________________________________

Password:
________________________________

Phone:
________________________________

Role:
staff
```

## STAFF 03

```text
Name:
________________________________

Email:
________________________________

Firebase UID:
________________________________

Password:
________________________________

Phone:
________________________________

Role:
staff
```

Repeat for every staff member.

SECURITY:
Do NOT upload this completed credential sheet to GitHub.
Do NOT put passwords into `index.html`, `login.js`, Firebase Realtime Database, GitHub, or public files.

---

# 20. Strong Password Recommendation

Use a unique password such as:

```text
16+ characters
uppercase
lowercase
numbers
symbols
```

Example FORMAT ONLY:

```text
Restaurant!2026#Owner
```

Do not use this exact example as your real password.

Recommended:
- Owner: unique password
- Every staff member: separate password
- Never share one password between staff members

---

# 21. Password Reset

Do not create your own password-reset database.

Use Firebase Authentication's password reset functionality.

The login page can provide:

```text
Forgot Password?
```

which sends a reset email.

---

# 22. Advanced Authentication Recommended for Production

For a real restaurant deployment, add:

```text
Firebase Authentication
+
Email/Password
+
Email verification
+
Password reset
+
Session monitoring
+
Role authorization
+
Firebase Database Rules
+
Storage Rules
+
Audit logs
+
Optional MFA for Owner
```

The Owner should preferably use Multi-Factor Authentication.

Never store MFA codes yourself.

---

# 23. Advanced Security Architecture

```text
                 CUSTOMER
                    │
                    ↓
             Public Website
                    │
                    ↓
              Firebase Auth
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
       OWNER                STAFF
          │                   │
          ↓                   ↓
   Full Management       Operations Only
          │                   │
          └─────────┬─────────┘
                    ↓
             Firebase Rules
                    │
          ┌─────────┴──────────┐
          ↓                    ↓
     Operational Data     Private Finance
          │                    │
          │                 OWNER ONLY
          ↓
      Realtime Database
          +
      Firebase Storage
```

---

# 24. Important Encryption Note

Firebase provides HTTPS/TLS transport and authentication/security controls.

Do NOT claim that simply using Firebase means every field is "advanced-level encrypted".

For highly sensitive information:
- use strict Firebase Security Rules
- use least-privilege access
- use MFA for Owner
- avoid storing unnecessary sensitive data
- use a trusted backend for server-side secrets
- never put encryption keys in frontend JavaScript

If application-level encryption is later required, encryption/decryption keys should NOT be embedded in the public website.

---

# 25. GitHub Security

NEVER commit:

```text
serviceAccountKey.json
private keys
admin SDK credentials
owner passwords
staff passwords
database export containing passwords
API secrets
```

The Firebase Web API key may appear in a frontend Firebase application; it is not a password. Security must come from Firebase Authentication and Rules.

---

# 26. Manual Setup Order

Do these steps in this exact order:

```text
1. Firebase Project
        ↓
2. Authentication
        ↓
3. Create Owner
        ↓
4. Create Staff
        ↓
5. Copy each UID
        ↓
6. Create users/{uid} role records
        ↓
7. Create Realtime Database
        ↓
8. Paste Database Rules
        ↓
9. Enable Storage
        ↓
10. Configure Storage Rules
        ↓
11. Deploy website
        ↓
12. Test Owner Login
        ↓
13. Test Staff Login
        ↓
14. Test staff financial denial
        ↓
15. Test menu photo upload
        ↓
16. Test online order
        ↓
17. Test manual order
```

---

# 27. Final Login Test

OWNER:

```text
Email → owner email
Password → owner password
```

Expected:

```text
Dashboard
Orders
Tables
Reservations
Customers
Menu
Inventory
Expenses
Revenue
Reports
Staff
Attendance
Equipment
Settings
```

STAFF:

```text
Email → staff email
Password → staff password
```

Expected:

```text
Dashboard
Orders
Tables
Reservations
Customers
Menu
Inventory
Staff
Attendance
Equipment
Settings
```

Staff should NOT be able to read:

```text
expenses/
revenue/
reports/
```

Even if they manually try the Firebase path.

---

# 28. Restaurant Template Customization

For a new restaurant, change only:

```text
Restaurant name
Logo
Colors
Hero image
Food menu
Food photos
Prices
Address
Phone
WhatsApp
Tables
Staff
Opening hours
Offers
```

The Firebase architecture can remain reusable.

---

# END
