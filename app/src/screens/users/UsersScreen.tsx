import { type FC, useEffect } from "react";
import { Typography } from "@mui/material";

import ContainerCustom from "@/components/reused/container/Container";
import Users from "@/components/ui/users/Users";
import useActionStore from "@/global-state/action.store";

const UsersScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);

  useEffect(() => {
    setNavMap([]);
  }, [setNavMap]);

  return (
    <main>
      <ContainerCustom>
        <div>
          <Typography variant={"h4"} textAlign={"center"} mt={2}>
            Users
          </Typography>
          <Users />
        </div>
      </ContainerCustom>
    </main>
  );
};

export default UsersScreen;
