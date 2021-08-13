import React from "react";

import "./Snackbar.css";

type SnackbarProps = {
  children: React.ReactNode;
  show: boolean;
  onSnackbarClose: () => void;
};

export const Snackbar = ({
  children,
  onSnackbarClose,
  show,
}: SnackbarProps) => {
  return (
    <>
      {show ? (
        <div className="snackbar">
          {children}{" "}
          <span className="snackbar-closebutton" onClick={onSnackbarClose}>
            X
          </span>
        </div>
      ) : null}
    </>
  );
};
