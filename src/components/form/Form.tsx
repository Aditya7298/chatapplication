import React from "react";

import "./Form.css";

type FormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => any;
  children: React.ReactNode;
};

export const Form = ({ onSubmit, children }: FormProps) => {
  return (
    <div className="form-container">
      <form className="form" onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
};
