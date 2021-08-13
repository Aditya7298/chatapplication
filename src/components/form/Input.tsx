import React from "react";

type InputProps = {
  type: string;
  name: string;
  value: string;
  label: string;
  placeholder: string;
  required?: boolean | undefined;
  error?: boolean;
  list?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
};

export const Input = ({
  name,
  type,
  value,
  onChange,
  label,
  required,
  error,
  placeholder,
  list,
}: InputProps) => {
  return (
    <label>
      {label}
      <input
        className={error ? "form-input form-input-error" : "form-input"}
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        list={list}
      />
    </label>
  );
};
