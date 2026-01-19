"use client";
import { SupabaseClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  userInfos: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


  export const UserInfosProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfos, setUserInfos] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserInfos = async () => {
      const supabase = SupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error("Error fetching user infos:", error.message);
        } else if (data) {
          setUserInfos(data as User);
        }
      }
    }
    fetchUserInfos();
  },[])

  return (
    <UserContext.Provider value={{ userInfos }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfos = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};