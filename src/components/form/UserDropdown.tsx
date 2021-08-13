import React, { useCallback } from "react";

import { Input } from "./Input";

import { useQuery } from "../hooks/useQuery";

type BasicUserInfo = {
  userName: string;
  avatar: string;
};

type UserDropdownProps = {
  onChange: (newUserName: string) => void;
  value: string;
};

export const UserDropdown = ({ value, onChange }: UserDropdownProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      onChange(value);
    },
    [onChange]
  );

  const { data: filteredUserData, status } = useQuery<BasicUserInfo[]>({
    path: `/users/filter/${value}`,
    skip: value.length === 0,
  });

  return (
    <>
      <Input
        label="Select a user "
        name="userQuery"
        type="text"
        value={value}
        placeholder="Enter a username"
        onChange={handleChange}
        list="user-list"
      ></Input>
      <datalist id="user-list">
        {status === "loading" ? (
          <option disabled>...loading</option>
        ) : (
          filteredUserData?.map((item) => (
            <option key={item.userName} value={item.userName}></option>
          ))
        )}
      </datalist>
    </>
  );
};
