import React from "react";

export default function Authenticate() {
  return (
    <div>
      <button
        onClick={() => {
          window.open("/auth/google", "_self");
        }}
      >
        sign in with google
      </button>
      <button
        onClick={() => {
          window.open("/auth/facebook", "_self");
        }}
      >
        facebook
      </button>
      <button>microsoft</button>
      <button>github/twitter</button>
    </div>
  );
}
