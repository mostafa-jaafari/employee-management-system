"use client";
import { SupabaseClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string;
}

interface UserContextType {
  userInfos: User | null;
  isLoadingUserInfos: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


  export const UserInfosProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfos, setUserInfos] = useState<User | null>(null);
  const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(true);

  useEffect(() => {
    const supabase = SupabaseClient();

    // Helper to fetch user info
    const fetchUserInfo = async (userId: string) => {
      setIsLoadingUserInfos(true); // ✅ start loading
      const { data: user, error } = await supabase
        .from("users")
        .select("id, name, email, role, avatar_url")
        .eq("id", userId)
        .single();

      if (error || !user) {
        setUserInfos(null);
      } else {
        setUserInfos({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
        });
      }
      setIsLoadingUserInfos(false); // ✅ stop loading
    };

    // Immediately check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserInfo(session.user.id);
      } else {
        setUserInfos(null);
        setIsLoadingUserInfos(false);
      }
    });

    // Subscribe to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          fetchUserInfo(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUserInfos(null);
          setIsLoadingUserInfos(false); // ✅ stop loading on sign out
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userInfos, isLoadingUserInfos }}>
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