import React, { type FC, useEffect, useRef, useState } from "react";
import { Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import usePagination from "@/hooks/use-pagination";
import { outputError } from "@/services/output-error";
import { deletePassById, getAllPass } from "@/api/password.api";
import { PasswordInterface } from "@/interface/password.interface";
import usePassColumns from "@/components/ui/password/pass-colums";
import ModalConfirm from "@/components/reused/modal/ModalConfirm";
import PassCreate from "@/components/ui/password/create/PassCreate";
import Search from "@/components/reused/search/Search";
import PasswordMore from "@/components/ui/password/more/PasswordMore";
import PassUpdate from "@/components/ui/password/update/PassUpdate";
import { EPrivilegeList } from "@/enum/privilege.enum";
import Privileges from "@/components/ui/privileges/Privileges";

type Props = {
  id: number | null;
};
const Password: FC<Props> = ({ id }) => {
  const {
    columns,
    deletePass,
    setDeletePass,
    editPass,
    setEditPass,
    isShowMore,
    setIsShowMore,
    privilegeShow,
    setPrivilegeShow,
  } = usePassColumns();
  const [list, setList] = useState<PasswordInterface[]>([]);
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
    if (isFetching.current || !id) return;
    isFetching.current = true;
    setIsLoading(true);

    getAllPass(queryGet, id)
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
  }, [refresh, id, queryGet]);

  return (
    <>
      <Privileges
        id={privilegeShow?.id || null}
        close={() => setPrivilegeShow(null)}
        title={privilegeShow?.name || ""}
        listType={EPrivilegeList.PASSWORD}
      />
      <PassCreate
        id={id}
        refresh={handleRefresh}
        close={() => setIsShowModalCreate(false)}
        isShow={isShowModalCreate}
      />
      <PassUpdate
        id={editPass}
        refresh={handleRefresh}
        close={() => setEditPass(null)}
      />
      <ModalConfirm
        id={deletePass}
        close={() => setDeletePass(null)}
        text={"Are you sure you want to delete the pass?"}
        refresh={handleRefresh}
        fetchApi={deletePassById}
      />
      <PasswordMore
        close={() => setIsShowMore(null)}
        password={list.find((i) => i.id === isShowMore)}
      />
      <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
        <Button
          variant={"contained"}
          onClick={() => setIsShowModalCreate(true)}
        >
          Create
        </Button>
        <Search
          fields={[
            {
              name: "Name",
              value: "name",
            },
            {
              name: "Entry",
              value: "entry",
            },
            {
              name: "Access",
              value: "access",
            },
          ]}
        />
      </Stack>
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
        // checkboxSelection
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

export default Password;
