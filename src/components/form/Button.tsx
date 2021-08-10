import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean | undefined;
  onClick?: (...args: any[]) => any;
  children: React.ReactNode;
};

export const Button = ({
  children,
  type = "submit",
  isDisabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      className="form-button"
    >
      {children}
    </button>
  );
};
