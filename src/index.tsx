import React from "react";
import ReactDOM from "react-dom/client";
import App from '@app/index';

// react-axe is disabled: it can break React 18 + createRoot and leave a blank page in dev.
// Re-enable after upgrading to a compatible a11y helper if needed.

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
