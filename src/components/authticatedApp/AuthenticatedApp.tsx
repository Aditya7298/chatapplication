import { Main } from "../main/Main";

import { useQuery } from "../hooks/useQuery";
import { UserContextProvider } from "../contexts/UserContext";

import { UserInfo } from "../../types/User.interface";

import loadingIcon from "../../assets/images/loading-animation.svg";

type AuthenticatedAppProps = {
  userId: string;
};

export const AuthenticatedApp = ({ userId }: AuthenticatedAppProps) => {
  const { data: userData } = useQuery<UserInfo>({
    path: `/users/${userId}`,
  });

  return (
    <>
      {userData ? (
        <UserContextProvider userData={userData}>
          <Main />
        </UserContextProvider>
      ) : (
        <div className="main-loading">
          <object
            className="main-loading-indicator"
            type="image/svg+xml"
            data={loadingIcon}
          >
            svg-animation
          </object>
        </div>
      )}
    </>
  );
};
