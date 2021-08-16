import React, { useState, useCallback } from "react";

import { Form } from "../../form/Form";
import { UserDropdown } from "../../form/UserDropdown";
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

  const { mutate, error } = useMutation((data) => {
    return ajaxClient.patch({
      path: `/chatrooms/${chatRoomId}/users`,
      payload: {
        userNames: [...data],
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

  const handleUserNameChange = useCallback((newUserName: string) => {
    setUserName(newUserName);
  }, []);

  return (
    <>
      <h2>Add a new user to {chatRoomName}</h2>
      <Form onSubmit={handleSubmit}>
        <UserDropdown value={userName} onChange={handleUserNameChange} />
        <Button>Add User</Button>
      </Form>
      <div className="error">{error}</div>
    </>
  );
};
