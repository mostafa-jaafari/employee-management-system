"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TokenUserInfosPayload } from "@/GlobalTypes";

interface UserContextType {
  userInfos: TokenUserInfosPayload | undefined;
  isLoadingUserInfos: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserInfosProvider = ({ children, user }: { children: React.ReactNode; user: TokenUserInfosPayload | undefined }) => {
  const [userInfos, setUserInfos] = useState<TokenUserInfosPayload | undefined>(undefined);
  const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(true);

  useEffect(() => {
    const Timer = setTimeout(() => {
      setUserInfos(user);
      setIsLoadingUserInfos(false);
    }, 0);

    return () => clearTimeout(Timer);
  }, [user]);

  return (
    <UserContext.Provider value={{ userInfos, isLoadingUserInfos }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfos = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserInfos must be used within a UserInfosProvider");
  }
  return context;
};
