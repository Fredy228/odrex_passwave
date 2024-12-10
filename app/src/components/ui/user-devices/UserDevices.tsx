import React, { type FC, useEffect, useRef, useState } from "react";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import { get } from "local-storage";

import usePagination from "@/hooks/use-pagination";
import { outputError } from "@/services/output-error";
import Search from "@/components/reused/search/Search";
import ModalConfirm from "@/components/reused/modal/ModalConfirm";
import useUserDevicesColumns from "@/components/ui/user-devices/user-devices-columns";
import { deleteSessionById, getAllSession } from "@/api/user-device.api";
import { UserDeviceInterface } from "@/interface/user.interface";

const UserDevice: FC = () => {
  const [list, setList] = useState<UserDeviceInterface[]>([]);
  const [total, setTotal] = useState<number>(0);

  const { page, sort, pageSize, setQuery, queryGet } = usePagination();
  const { columns, deleteSession, setDeleteSession } = useUserDevicesColumns();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    getAllSession(queryGet)
      .then((data) => {
        setTotal(data.total);
        setList(data.data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [pageSize, sort, page, refresh, queryGet]);

  return (
    <>
      <ModalConfirm
        id={deleteSession}
        close={() => setDeleteSession(null)}
        text={"Are you sure you want to delete the session?"}
        refresh={() => setRefresh((prev) => !prev)}
        fetchApi={deleteSessionById}
      />
      <Search
        fields={[
          {
            name: "IP",
            value: "ipAddress",
          },
        ]}
      />
      <DataGrid
        sx={{
          margin: "20px 0",
          "& .highlight-row": {
            backgroundColor: "#d7e7ff",
          },
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
        getRowClassName={(params: GridRowParams) =>
          params.row.accessToken === get("token") ? "highlight-row" : ""
        }
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

export default UserDevice;
