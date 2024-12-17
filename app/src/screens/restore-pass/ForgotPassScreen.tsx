import { type FC, useEffect } from "react";
import Box from "@mui/material/Box";

import ContainerCustom from "@/components/reused/container/Container";
import SendForgotPass from "@/components/ui/restore-pass/SendForgotPass";
import useActionStore from "@/global-state/action.store";
import { Typography } from "@mui/material";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { BoxIcon } from "@/components/ui/auth/auth-form/auth-form.styled";

const ForgotPassScreen: FC = () => {
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
            <PermIdentityIcon
              sx={{
                width: "30px",
                height: "30px",
                color: "#fff",
              }}
            />
          </BoxIcon>
          <Typography variant={"h4"} marginBottom={"10px"}>
            Forgot password
          </Typography>
          <Typography
            variant={"body1"}
            marginBottom={"10px"}
            fontSize={"small"}
            mt={2}
          >
            Send a letter of reinstatement
          </Typography>
          <SendForgotPass />
        </Box>
      </ContainerCustom>
    </main>
  );
};

export default ForgotPassScreen;
