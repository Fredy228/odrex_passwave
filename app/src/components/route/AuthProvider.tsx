import { type FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "local-storage";
import { toast } from "react-toastify";

import LoadingPage from "../reused/loading-page/LoadingPage";
import useUserStore from "@/global-state/user.store";
import { getMe } from "@/api/user.api";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isFetching.current) return;
    const token = get("token");
    if (!token) return navigate("/auth/login");

    if (!user) {
      isFetching.current = true;
      getMe()
        .then((data) => {
          setUser(data);
          setIsLoading(false);
          isFetching.current = false;
        })
        .catch(() => toast.error("Something went wrong. Reload page."));
    } else setIsLoading(false);
  }, [navigate, setUser, user]);

  if (isLoading) return <LoadingPage />;

  return <>{children}</>;
};

export default AuthProvider;
