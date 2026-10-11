import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const button = document.querySelector("#loginBtn");
const forgotButton = document.querySelector("#forgotBtn");
const message = document.querySelector("#message");

function show(text, error = true) {
  message.textContent = text;
  message.style.color = error ? "#b34d48" : "#26734d";
}

button.addEventListener("click", async () => {
  show("");
  if (!email.value.trim() || !password.value) {
    show("Enter your email and password.");
    return;
  }
  button.disabled = true;
  button.textContent = "Signing in…";
  try {
    const credential = await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
    const uid = credential.user.uid;
    const snap = await get(ref(db, `users/${uid}`));
    if (!snap.exists()) {
      await auth.signOut();
      throw new Error("NO_ROLE");
    }
    const profile = snap.val();
    const role = profile.role;
    if (role !== "owner" && role !== "staff") {
      await auth.signOut();
      throw new Error("BAD_ROLE");
    }
    sessionStorage.setItem("restaurantUser", JSON.stringify({
      uid, email: credential.user.email, role, name: profile.name || "User"
    }));
    show("Login successful. Opening dashboard…", false);
    setTimeout(() => location.href = "dashboard.html", 350);
  } catch (e) {
    const code = e?.code || e?.message;
    if (code === "NO_ROLE" || code === "BAD_ROLE") show("Your account does not have a valid restaurant role. Check the UID and role in Realtime Database.");
    else if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") show("Incorrect email or password. Use Forgot password if needed.");
    else if (code === "auth/too-many-requests") show("Too many attempts. Please wait and try again.");
    else if (code === "PERMISSION_DENIED" || code === "permission_denied") show("Firebase Database permission denied. Check Realtime Database Rules.");
    else show(`Login failed (${code || "unknown error"}). Check Firebase setup and database rules.`);
  } finally {
    button.disabled = false;
    button.textContent = "Sign in securely";
  }
});

forgotButton.addEventListener("click", async () => {
  const address = email.value.trim();
  if (!address) {
    show("Enter your email above first, then click Forgot password?");
    email.focus();
    return;
  }
  forgotButton.disabled = true;
  forgotButton.textContent = "Sending reset link…";
  try {
    await sendPasswordResetEmail(auth, address);
    show("If an account exists for this email, a password-reset link has been sent. Check your inbox and spam folder.", false);
  } catch (e) {
    const code = e?.code;
    if (code === "auth/invalid-email") show("Enter a valid email address.");
    else if (code === "auth/too-many-requests") show("Too many requests. Wait a while and try again.");
    else show("Could not send reset email. Check Firebase Authentication settings and authorized domains.");
  } finally {
    forgotButton.disabled = false;
    forgotButton.textContent = "Forgot password?";
  }
});

password.addEventListener("keydown", e => { if (e.key === "Enter") button.click(); });
