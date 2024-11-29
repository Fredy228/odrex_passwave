import React, { type FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";

import {
  Item,
  ItemContent,
  List,
} from "@/components/reused/plate-list/plate-item.styled";
import useUserStore from "@/global-state/user.store";
import { HallInterface } from "@/interface/hall.interface";
import usePagination from "@/hooks/use-pagination";
import { scrollToTop } from "@/services/scroll-to-top";
import { deleteHallById, getAllHalls } from "@/api/hall.api";
import { outputError } from "@/services/output-error";
import { RoleEnum } from "@/enum/role.enum";
import {
  ButtonCircleRight,
  ButtonCreate,
} from "@/components/reused/button/button-create.styled";
import HallCreate from "@/components/ui/hall/create/HallCreate";
import HallUpdate from "@/components/ui/hall/update/HallUpdate";
import SettingsIcon from "@mui/icons-material/Settings";
import { CompanyInterface } from "@/interface/company.interface";
import Privileges from "@/components/ui/privileges/Privileges";
import { EPrivilegeList } from "@/enum/privilege.enum";
import ModalConfirm from "@/components/reused/modal/ModalConfirm";

type Props = {
  parentCompany: CompanyInterface | null;
};
const Hall: FC<Props> = ({ parentCompany }) => {
  const { companyId } = useParams();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [list, setListHall] = useState<HallInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [deleteHall, setDeleteHall] = useState<number | null>(null);
  const [updateHall, setUpdateHall] = useState<number | null>(null);

  const { page, pageSize, setQuery, queryGet } = usePagination();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
  const [isShowSettings, setIsShowSettings] = useState<number | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const onItemClick = (id: number) => {
    if (!companyId) return;
    navigate(`/company/${companyId}/hall/${id}`);
  };

  const handleSetPage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setQuery([{ field: "page", value: String(value) }]);
    scrollToTop();
  };

  useEffect(() => {
    if (isFetching.current || !companyId || Boolean(isShowSettings)) return;
    isFetching.current = true;
    setIsLoading(true);

    getAllHalls(queryGet, Number(companyId))
      .then((data) => {
        console.log("data", data);
        setTotal(data.total);
        setListHall(data.data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [refresh, companyId, queryGet]);

  return (
    <>
      <Privileges
        id={isShowSettings}
        close={() => setIsShowSettings(null)}
        title={parentCompany?.name || ""}
        listType={EPrivilegeList.COMPANY}
      />
      <HallCreate
        close={() => setIsShowModalCreate(false)}
        isShow={isShowModalCreate}
        refresh={() => setRefresh((prev) => !prev)}
        id={Number(companyId)}
      />
      <HallUpdate
        id={updateHall}
        close={() => setUpdateHall(null)}
        refresh={() => setRefresh((prev) => !prev)}
      />
      <ModalConfirm
        id={deleteHall}
        close={() => setDeleteHall(null)}
        text={"Are you sure you want to delete the hall?"}
        refresh={() => setRefresh((prev) => !prev)}
        fetchApi={deleteHallById}
      />
      {user?.role === RoleEnum.ADMIN && (
        <>
          <ButtonCreate onClick={() => setIsShowModalCreate(true)}>
            <AddIcon />
          </ButtonCreate>
          <ButtonCircleRight
            onClick={() => setIsShowSettings(Number(companyId))}
          >
            <SettingsIcon />
          </ButtonCircleRight>
        </>
      )}
      <List>
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((i) => (
              <Item elevation={3} key={i} sx={{ padding: "50px 25px" }}>
                <Skeleton variant={"circular"} width={35} height={35} />
                <Skeleton variant={"text"} width={"100%"} />
              </Item>
            ))
          : list.map((item) => (
              <Tooltip key={item.id} title={item.notes}>
                <Item elevation={3}>
                  <ItemContent onClick={() => onItemClick(item.id)}>
                    <MeetingRoomIcon />
                    <Typography fontWeight={600} fontSize={"large"}>
                      {item.name}
                    </Typography>
                  </ItemContent>
                  {user?.role === RoleEnum.ADMIN && (
                    <Stack
                      direction={"row"}
                      spacing={0}
                      title={"action"}
                      position={"absolute"}
                      zIndex={200}
                      sx={{ top: "10px", right: "10px" }}
                    >
                      <IconButton
                        type={"button"}
                        onClick={() => setUpdateHall(item.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        type={"button"}
                        onClick={() => setDeleteHall(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  )}
                </Item>
              </Tooltip>
            ))}
      </List>
      {!list.length && !isLoading && (
        <Typography mt={2} fontWeight={600} textAlign={"center"}>
          The list of halls is empty
        </Typography>
      )}

      {Math.ceil(total / pageSize) > 1 && !isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            sx={{
              margin: "25px 0",
            }}
            count={Math.ceil(total / pageSize)}
            page={page}
            onChange={handleSetPage}
          />
        </Box>
      )}
    </>
  );
};

export default Hall;
