"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client"; // Use the new Browser Client
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
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
  
  // Use the Browser Client
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async (userId: string) => {
      // Fetch from your custom users table
      const { data: user, error } = await supabase
        .from("users")
        .select("id, name, email, role, avatar_url")
        .eq("id", userId)
        .single();

      if (error || !user) {
        console.error("Error fetching user details:", error);
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
      setIsLoadingUserInfos(false);
    };

    const initializeAuth = async () => {
        setIsLoadingUserInfos(true);
        // Check active session on mount
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserInfo(session.user.id);
        } else {
          setUserInfos(null);
          setIsLoadingUserInfos(false);
        }
    };

    initializeAuth();

    // Listen for Auth Changes (Login, Logout, Auto-Refresh)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await fetchUserInfo(session.user.id);
          router.refresh(); // 🔥 Force Server Components to re-render
        } else if (event === "SIGNED_OUT") {
          setUserInfos(null);
          setIsLoadingUserInfos(false);
          router.refresh(); // 🔥 Force Server Components to clear data
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [supabase, router]);

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