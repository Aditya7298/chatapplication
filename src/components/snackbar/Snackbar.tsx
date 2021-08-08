import React from "react";

import "./Snackbar.css";

type SnackbarProps = {
  children: React.ReactNode;
  onSnackbarClose: () => void;
};

export const Snackbar = ({ children, onSnackbarClose }: SnackbarProps) => {
  return (
    <div className="snackbar">
      {children}{" "}
      <span className="snackbar-closebutton" onClick={onSnackbarClose}>
        X
      </span>
    </div>
  );
};
