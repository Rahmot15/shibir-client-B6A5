"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe, logoutUser, UserData } from "@/lib/authService";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  setUser: (user: UserData | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkUser() {
      try {
        const result = await getMe();
        if (result.success && result.data) {
          setUser(result.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("সফলভাবে লগআউট হয়েছে");
      router.push("/");
    } catch (error) {
      toast.error("লগআউট ব্যর্থ হয়েছে");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
