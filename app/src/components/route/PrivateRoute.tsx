import { type FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { get } from "local-storage";

import useUserStore from "@/global-state/user.store";
import { RoleEnum } from "@/enum/role.enum";
import { toast } from "react-toastify";

type Props = {
  access?: RoleEnum[];
} & PropsWithChildren;
const PrivateRoute: FC<Props> = ({ children, access = [] }) => {
  const user = useUserStore((state) => state.user);

  const token = get("token");
  if (!token || !user) return <Navigate to={"/auth/login"} />;

  if (access.length > 0 && !access.includes(user.role)) {
    toast.warning("You do not have access to this page");
    return <Navigate to={"/"} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
