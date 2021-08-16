import React, { useEffect } from "react";

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
  useEffect(() => {
    if (!children) {
      return;
    }

    const timerId = setTimeout(() => {
      onSnackbarClose();
    }, 2000);

    return () => clearTimeout(timerId);
  }, [children, onSnackbarClose]);

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
