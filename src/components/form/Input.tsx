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
  maxLength?: number;
  minLength?: number;
  pattern?: string;
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
  maxLength,
  minLength,
  pattern,
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
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        list={list}
      />
    </label>
  );
};
