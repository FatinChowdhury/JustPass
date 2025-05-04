// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp, RedirectToSignIn } from '@clerk/clerk-react';
import ProtectedPage from './pages/ProtectedPage/ProtectedPage.js';
import Landing from "./pages/Landing/Landing.js";
// import Dashboard from "./pages/Dashboard/Dashboard.js";
import "./App.css";

function App() {

  // useEffect(() => {
  //   // Check if the user is authenticated
  //   const isAuthenticated = localStorage.getItem('isAuthenticated');
  //   if (isAuthenticated) {
  //     // Redirect to the dashboard if authenticated
  //     window.location.href = '/dashboard';
  //   } else {
  //     // Redirect to the landing page if not authenticated
  //     window.location.href = '/';
  //   }
  // })


  // useEffect(() => {
  //   // Get token for testing
  //   const getSessionToken = async () => {
  //     const clerkSession = Clerk.session;
  //     const getSessionToken = await clerkSession.getToken();
  //     console.log('Testing token: ', getSessionToken);
  //   };

  //   if (process.env.NODE_ENV === 'development') {
  //     getSessionToken();
  //   }
  // } , []);

  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Landing/>} />

      {/* Sign-In Route */}
      <Route
        path="/sign-in/*"
        element={
          <div className="auth-container">
            <SignIn fallbackRedirectUrl={'/protected'} routing="path" path="/sign-in" />
          </div>
        }
      />

      {/* Sign-Up Route */}
      <Route
        path="/sign-up"
        element={<SignUp fallbackRedirectUrl={'/protected'} routing="path" path="/sign-up" />}
      />

      {/* Sign-Out Route */}
      <Route
        path="/sign-out"
        element={<RedirectToSignIn routing="path" path="/sign-in" />}
      />

      {/* Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <>
            <SignedIn>
              <ProtectedPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      {/* Protected Route */}
      <Route
        path="/protected"
        element={
          <>
            <SignedIn>
              <ProtectedPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;