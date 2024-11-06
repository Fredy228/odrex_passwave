import React, { type FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconButton,
  Pagination,
  Skeleton,
  Stack,
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
import { QueryGetType } from "@/types/query.type";
import { getAllHalls } from "@/api/hall.api";
import { outputError } from "@/services/output-error";
import { RoleEnum } from "@/enum/role.enum";
import { ButtonCreate } from "@/components/reused/button/button-create.styled";
import HallCreate from "@/components/ui/hall/create/HallCreate";
import HallDelete from "@/components/ui/hall/delete/HallDelete";
import HallUpdate from "@/components/ui/hall/update/HallUpdate";

const Hall: FC = () => {
  const { companyId } = useParams();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [list, setListHall] = useState<HallInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [deleteHall, setDeleteHall] = useState<number | null>(null);
  const [updateHall, setUpdateHall] = useState<number | null>(null);

  const { page, sort, pageSize, filter, setQuery } = usePagination();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
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
    if (isFetching.current || !companyId) return;
    isFetching.current = true;
    setIsLoading(true);

    const options: QueryGetType = {
      range: [page * pageSize - pageSize + 1, page * pageSize],
    };
    if (sort) options.sort = sort;
    if (filter) options.filter = filter;

    getAllHalls(options, Number(companyId))
      .then((data) => {
        // console.log("data", data);
        setTotal(data.total);
        setListHall(data.data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [pageSize, sort, page, filter, refresh, companyId]);

  return (
    <>
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
      <HallDelete
        close={() => setDeleteHall(null)}
        refresh={() => setRefresh((prev) => !prev)}
        id={deleteHall}
      />
      {user?.role === RoleEnum.ADMIN && (
        <ButtonCreate onClick={() => setIsShowModalCreate(true)}>
          <AddIcon />
        </ButtonCreate>
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
              <Item key={item.id} elevation={3}>
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
