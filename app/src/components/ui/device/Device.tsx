import React, { type FC, useEffect, useRef, useState } from "react";

import { RoleEnum } from "@/enum/role.enum";
import {
  ButtonCircleRight,
  ButtonCreate,
} from "@/components/reused/button/button-create.styled";
import AddIcon from "@mui/icons-material/Add";
import useUserStore from "@/global-state/user.store";
import DeviceSchema from "@/components/ui/device/schema/DeviceSchema";
import { DeviceInterface } from "@/interface/device.interface";
import { useParams } from "react-router-dom";
import { getAllDevices } from "@/api/device.api";
import { outputError } from "@/services/output-error";
import DeviceCreate from "@/components/ui/device/create/DeviceCreate";
import { EPrivilegeList } from "@/enum/privilege.enum";
import Privileges from "@/components/ui/privileges/Privileges";
import { HallInterface } from "@/interface/hall.interface";
import SettingsIcon from "@mui/icons-material/Settings";

type Props = {
  parentHall: HallInterface | null;
};
const Device: FC<Props> = ({ parentHall }) => {
  const { hallId } = useParams();
  const user = useUserStore((state) => state.user);

  const [list, setList] = useState<DeviceInterface[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
  const [isShowSettings, setIsShowSettings] = useState<number | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    if (isFetching.current || !hallId) return;
    isFetching.current = true;
    setIsLoading(true);

    getAllDevices(Number(hallId))
      .then((data) => {
        setList(data);
        // console.log(data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [hallId, refresh]);

  return (
    <>
      <Privileges
        id={isShowSettings}
        close={() => setIsShowSettings(null)}
        title={parentHall?.name || ""}
        listType={EPrivilegeList.HALL}
      />
      <DeviceCreate
        list={list}
        isShow={isShowModalCreate}
        close={() => setIsShowModalCreate(false)}
        id={Number(hallId)}
        refresh={handleRefresh}
      />
      {user?.role === RoleEnum.ADMIN && (
        <>
          <ButtonCreate onClick={() => setIsShowModalCreate(true)}>
            <AddIcon />
          </ButtonCreate>
          <ButtonCircleRight onClick={() => setIsShowSettings(Number(hallId))}>
            <SettingsIcon />
          </ButtonCircleRight>
        </>
      )}
      {!isLoading && <DeviceSchema devices={list} refresh={handleRefresh} />}
    </>
  );
};

export default Device;
