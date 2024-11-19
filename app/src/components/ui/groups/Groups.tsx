import React, { type FC, useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

import { GroupInterface } from "@/interface/group.interface";
import usePagination from "@/hooks/use-pagination";
import useGroupColumns from "@/components/ui/groups/groups-columls";
import { deleteGroupById, getAllGroup } from "@/api/group.api";
import { outputError } from "@/services/output-error";
import { GroupType } from "@/enum/group.enum";
import { ButtonCreate } from "@/components/reused/button/button-create.styled";
import GroupCreate from "@/components/ui/groups/create/GroupCreate";
import ModalConfirm from "@/components/reused/modal/ModalConfirm";
import GroupUpdate from "@/components/ui/groups/update/GroupUpdate";
import GroupsUsers from "@/components/ui/groups/users/GroupsUsers";

const Groups: FC = () => {
  const {
    columns,
    deleteGroup,
    setDeleteGroup,
    editGroup,
    setEditGroup,
    usersGroup,
    setUsersGroup,
  } = useGroupColumns();
  const [list, setList] = useState<GroupInterface[]>([]);
  const [total, setTotal] = useState<number>(0);

  const { pageSize, setQuery, queryGet } = usePagination();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    getAllGroup({
      ...queryGet,
      filter: {
        type: GroupType.ADDITIONAL,
      },
    })
      .then((data) => {
        console.log("data", data);
        setTotal(data.total);
        setList(data.data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [refresh, queryGet]);

  return (
    <>
      <GroupsUsers close={() => setUsersGroup(null)} group={usersGroup} />
      <GroupUpdate
        close={() => setEditGroup(null)}
        group={editGroup}
        refresh={handleRefresh}
      />
      <ModalConfirm
        id={deleteGroup}
        close={() => setDeleteGroup(null)}
        text={"Are you sure you want to delete the group?"}
        refresh={handleRefresh}
        fetchApi={deleteGroupById}
      />
      <GroupCreate
        close={() => setIsShowModalCreate(false)}
        isShow={isShowModalCreate}
        refresh={handleRefresh}
      />
      <ButtonCreate onClick={() => setIsShowModalCreate(true)}>
        <AddIcon />
      </ButtonCreate>
      <DataGrid
        sx={{
          margin: "20px 0",
        }}
        rows={list}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        pageSizeOptions={[15, 20, 30, 50, 100]}
        disableRowSelectionOnClick
        loading={isLoading}
        rowCount={total}
        paginationMode={"server"}
        onPaginationModelChange={(params) => {
          setQuery([
            { field: "page", value: String(params.page + 1) },
            { field: "size", value: String(params.pageSize) },
          ]);
        }}
      />
    </>
  );
};

export default Groups;
