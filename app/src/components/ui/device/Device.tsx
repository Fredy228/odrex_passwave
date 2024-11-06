import React, { type FC, useEffect, useRef, useState } from "react";

import { RoleEnum } from "@/enum/role.enum";
import { ButtonCreate } from "@/components/reused/button/button-create.styled";
import AddIcon from "@mui/icons-material/Add";
import useUserStore from "@/global-state/user.store";
import DeviceSchema from "@/components/ui/device/schema/DeviceSchema";
import { DeviceInterface } from "@/interface/device.interface";
import { useParams } from "react-router-dom";
import { getAllDevices } from "@/api/device.api";
import { outputError } from "@/services/output-error";
import DeviceCreate from "@/components/ui/device/create/DeviceCreate";

const Device: FC = () => {
  const { hallId } = useParams();
  const user = useUserStore((state) => state.user);

  const [list, setList] = useState<DeviceInterface[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
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
      <DeviceCreate
        list={list}
        isShow={isShowModalCreate}
        close={() => setIsShowModalCreate(false)}
        id={Number(hallId)}
        refresh={handleRefresh}
      />
      {user?.role === RoleEnum.ADMIN && (
        <ButtonCreate onClick={() => setIsShowModalCreate(true)}>
          <AddIcon />
        </ButtonCreate>
      )}
      {!isLoading && <DeviceSchema devices={list} refresh={handleRefresh} />}
    </>
  );
};

export default Device;
