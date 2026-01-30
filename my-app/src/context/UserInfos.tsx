"use client";

import { SupabaseClient } from "@/lib/supabase/client"; 
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "guest";
  avatar_url: string | null;
}

interface UserContextType {
  userInfos: User | null;
  isLoadingUserInfos: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserInfosProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfos, setUserInfos] = useState<User | null>(null);
  const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(true);
  const supabase = SupabaseClient();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // 🔹 لمنع تحديث state بعد unmount

    const fetchUserInfo = async (userId: string) => {
      try {
        const { data: user, error } = await supabase
          .from("users")
          .select("id, name, email, role, avatar_url")
          .eq("id", userId)
          .single();

        if (!isMounted) return;

        if (error || !user) {
          console.error("Error fetching user details:", error);
          setUserInfos(null);
        } else {
          setUserInfos({
            id: user.id,
            name: user.name || "No Name",
            email: user.email,
            role: user.role || "guest",
            avatar_url: user.avatar_url || null,
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        if (isMounted) setUserInfos(null);
      } finally {
        if (isMounted) setIsLoadingUserInfos(false);
      }
    };

    const initializeAuth = async () => {
      setIsLoadingUserInfos(true);
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (session?.user?.id) {
          await fetchUserInfo(session.user.id);
        } else {
          setUserInfos(null);
          setIsLoadingUserInfos(false);
        }
      } catch (err) {
        console.error(err);
        setUserInfos(null);
        setIsLoadingUserInfos(false);
      }
    };

    initializeAuth();

    // Subscription for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" && session?.user?.id) {
        await fetchUserInfo(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUserInfos(null);
        setIsLoadingUserInfos(false);
      }

      router.refresh(); // تحديث Server Components
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe(); // تنظيف الاشتراك
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
