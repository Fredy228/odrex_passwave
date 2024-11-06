import { type FC, PropsWithChildren, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { get } from "local-storage";

import useUserStore from "@/global-state/user.store";
import LoadingPage from "../reused/loading-page/LoadingPage";

const RestrictedRoute: FC<PropsWithChildren> = ({ children }) => {
  const user = useUserStore((state) => state.user);

  const token = get("token");
  if (user || token) return <Navigate to={"/"} />;

  return <Suspense fallback={<LoadingPage />}>{children}</Suspense>;
};

export default RestrictedRoute;
