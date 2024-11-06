import { type FC, useEffect } from "react";
import { Typography } from "@mui/material";

import ContainerCustom from "@/components/reused/container/Container";
import useActionStore from "@/global-state/action.store";

const GroupsScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);

  useEffect(() => {
    setNavMap([]);
  }, [setNavMap]);

  return (
    <main>
      <ContainerCustom>
        <div>
          <Typography variant={"h4"} textAlign={"center"} mt={2}>
            Groups
          </Typography>
        </div>
      </ContainerCustom>
    </main>
  );
};

export default GroupsScreen;
