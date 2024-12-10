import { type FC, useEffect } from "react";
import Box from "@mui/material/Box";

import ContainerCustom from "@/components/reused/container/Container";
import TryLogin from "@/components/ui/try-login/TryLogin";
import useActionStore from "@/global-state/action.store";
import { Typography } from "@mui/material";

const TryLoginScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);

  useEffect(() => {
    setNavMap([]);
  }, [setNavMap]);

  return (
    <main>
      <ContainerCustom>
        <Box>
          <Typography variant={"h4"} textAlign={"center"} mt={2}>
            Try login
          </Typography>
          <TryLogin />
        </Box>
      </ContainerCustom>
    </main>
  );
};

export default TryLoginScreen;
