import { type FC, useEffect } from "react";
import Box from "@mui/material/Box";

import ContainerCustom from "@/components/reused/container/Container";
import useActionStore from "@/global-state/action.store";
import { Typography } from "@mui/material";
import UserDevice from "@/components/ui/user-devices/UserDevices";

const UserDeviceScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);

  useEffect(() => {
    setNavMap([]);
  }, [setNavMap]);

  return (
    <main>
      <ContainerCustom>
        <Box>
          <Typography variant={"h4"} textAlign={"center"} mt={2}>
            Sessions
          </Typography>
          <UserDevice />
        </Box>
      </ContainerCustom>
    </main>
  );
};

export default UserDeviceScreen;
