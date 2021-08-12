import React, { useState } from "react";

import { Form } from "../../form/Form";
import { Input } from "../../form/Input";
import { Button } from "../../form/Button";

import { useMutation } from "../../hooks/useMutation";

import { ajaxClient } from "../../utils/ajaxClient";

type AddUserToGroupProps = {
  chatRoomId: string;
  chatRoomName: string;
  onNewUserAddition: (newUserName: string) => void;
};

export const AddUserToGroup = ({
  chatRoomId,
  chatRoomName,
  onNewUserAddition,
}: AddUserToGroupProps) => {
  const [userName, setUserName] = useState<string>("");

  const { mutate, error: errorMessage } = useMutation((data) => {
    return ajaxClient.patch({
      path: `/chatrooms/${chatRoomId}`,
      payload: {
        key: "userNames",
        value: [...data],
      },
    });
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate([userName], {
      onSuccess: () => {
        onNewUserAddition(userName);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserName(value);
  };

  return (
    <>
      <h2>Add a new user to {chatRoomName}</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="name"
          value={userName}
          onChange={handleChange}
          placeholder="Enter username"
        />
        <Button>Add User</Button>
      </Form>
      <div className="error">{errorMessage}</div>
    </>
  );
};
