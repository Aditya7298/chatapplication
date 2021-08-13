import { Main } from "../main/Main";

import { useQuery } from "../hooks/useQuery";
import { UserContextProvider } from "../contexts/UserContext";

import { UserInfo } from "../../types/User.interface";

type AuthenticatedAppProps = {
  userId: string;
};

export const AuthenticatedApp = ({ userId }: AuthenticatedAppProps) => {
  const { data: userData } = useQuery<UserInfo>({
    path: `/users/${userId}`,
    queryInterval: 1000,
  });

  return (
    <>
      {userData ? (
        <UserContextProvider userData={userData}>
          <Main />
        </UserContextProvider>
      ) : null}
    </>
  );
};
