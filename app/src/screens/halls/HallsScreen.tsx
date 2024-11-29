import { type FC, useEffect, useState } from "react";
import useActionStore from "@/global-state/action.store";
import { useParams } from "react-router-dom";
import ContainerCustom from "@/components/reused/container/Container";
import Device from "@/components/ui/device/Device";
import { outputError } from "@/services/output-error";
import { HallInterface } from "@/interface/hall.interface";
import { getHallById } from "@/api/hall.api";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

const HallsScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);
  const { companyId, hallId } = useParams();
  const [hall, setHall] = useState<HallInterface | null>(null);

  useEffect(() => {
    setNavMap([
      {
        path: "/",
        name: "Companies",
      },
      {
        path: `company/${companyId}/`,
        name: "Halls",
      },
      {
        path: `hall/${hallId}/`,
        name: "Computers",
      },
    ]);

    if (Number(hallId))
      getHallById(Number(hallId))
        .then((data) => setHall(data))
        .catch(outputError);
  }, [setNavMap, companyId, hallId]);

  return (
    <main>
      <ContainerCustom>
        <Box>
          <Typography variant={"h5"}>{hall?.name}</Typography>
          <Device parentHall={hall} />
        </Box>
      </ContainerCustom>
    </main>
  );
};

export default HallsScreen;
