import { type FC, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

import useActionStore from "@/global-state/action.store";
import ContainerCustom from "@/components/reused/container/Container";
import { BoxIcon } from "@/components/ui/auth/auth-form/auth-form.styled";
import RestorePass from "@/components/ui/restore-pass/RestorePass";

const RestorePassScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);

  useEffect(() => {
    setNavMap([]);
  }, [setNavMap]);

  return (
    <main>
      <ContainerCustom>
        <Box
          width={"100%"}
          height={"100vh"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <BoxIcon>
            <SettingsBackupRestoreIcon
              sx={{
                width: "30px",
                height: "30px",
                color: "#fff",
              }}
            />
          </BoxIcon>
          <Typography variant={"h4"} marginBottom={"10px"}>
            Restore password
          </Typography>
          <Typography
            variant={"body1"}
            marginBottom={"10px"}
            fontSize={"small"}
            mt={2}
          >
            Enter new password and repeat
          </Typography>
          <RestorePass />
        </Box>
      </ContainerCustom>
    </main>
  );
};

export default RestorePassScreen;
