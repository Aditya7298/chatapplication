import { useState, useCallback } from "react";

import { UnauthenticatedApp } from "../unauthenticatedApp/UnauthenticatedApp";
import { AuthenticatedApp } from "../authticatedApp/AuthenticatedApp";

import "./ChatApp.css";

export const ChatApp = () => {
  const [userId, setUserId] = useState<string | undefined>();

  const handleAuthentication = useCallback((userId: string) => {
    setUserId(userId);
  }, []);

  return (
    <div className="chatapp">
      {userId ? (
        <AuthenticatedApp userId={userId} />
      ) : (
        <UnauthenticatedApp onAuthentication={handleAuthentication} />
      )}
    </div>
  );
};
