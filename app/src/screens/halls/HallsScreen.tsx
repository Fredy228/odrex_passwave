import { type FC, useEffect } from "react";
import useActionStore from "@/global-state/action.store";
import { useParams } from "react-router-dom";
import ContainerCustom from "@/components/reused/container/Container";
import Device from "@/components/ui/device/Device";

const HallsScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);
  const { companyId, hallId } = useParams();

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
  }, [setNavMap, companyId, hallId]);

  return (
    <main>
      <ContainerCustom>
        <div>
          <Device />
        </div>
      </ContainerCustom>
    </main>
  );
};

export default HallsScreen;
