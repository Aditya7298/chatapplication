import React, { useContext } from "react";

import { UserInfo } from "../../types/User.interface";

type UserContextProviderProps = {
  userData: UserInfo;
  children: React.ReactNode;
};

export const UserContext = React.createContext<UserInfo>({} as UserInfo);

export const UserContextProvider = ({
  userData,
  children,
}: UserContextProviderProps) => {
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
