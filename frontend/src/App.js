// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp, RedirectToSignIn } from '@clerk/clerk-react';
import ProtectedPage from './pages/ProtectedPage/ProtectedPage';
import Landing from "./pages/Landing/Landing.js";

function App() {
  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Landing/>} />

      {/* Sign-In Route */}
      <Route
        path="/sign-in"
        element={<SignIn fallbackRedirectUrl={'/protected'} routing="path" path="/sign-in" />}
      />

      {/* Sign-Up Route */}
      <Route
        path="/sign-up"
        element={<SignUp fallbackRedirectUrl={'/protected'} routing="path" path="/sign-up" />}
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