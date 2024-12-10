import React, {
  type FC,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TabContext, TabList } from "@mui/lab";
import { Box, IconButton, Stack, Tab, useMediaQuery } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

import usePagination from "@/hooks/use-pagination";
import useTryLoginColumns from "@/components/ui/try-login/try-login-columns";
import { TryLoginInterface } from "@/interface/try-login.interface";
import { outputError } from "@/services/output-error";
import {
  deleteTryLoginByIds,
  getAllBlockedIp,
  getAllTryLogin,
  unblockIpAddress,
} from "@/api/try-login.api";
import Search from "@/components/reused/search/Search";
import ModalConfirm from "@/components/reused/modal/ModalConfirm";

const TryLogin: FC = () => {
  const [list, setList] = useState<TryLoginInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [tab, setTab] = useState<"history" | "block">("history");
  const isMoreMobile = useMediaQuery("(min-width:768px)");

  const { page, sort, pageSize, setQuery, queryGet } = usePagination();
  const { columns, setDeleteHistory, deleteHistory, unblock, setUnblock } =
    useTryLoginColumns(tab);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleTabChange = (
    _event: SyntheticEvent,
    newValue: "history" | "block",
  ) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    const fn = tab === "history" ? getAllTryLogin : getAllBlockedIp;

    fn(queryGet)
      .then((data) => {
        setTotal(data.total);
        setList(data.data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [pageSize, sort, page, refresh, queryGet, tab]);

  return (
    <>
      <ModalConfirm
        id={deleteHistory}
        close={() => setDeleteHistory(null)}
        text={"Are you sure you want to delete history?"}
        refresh={() => setRefresh((prev) => !prev)}
        fetchApi={deleteTryLoginByIds}
      />
      <ModalConfirm
        id={unblock}
        close={() => setUnblock(null)}
        text={"Are you sure you want to unblock?"}
        refresh={() => setRefresh((prev) => !prev)}
        fetchApi={unblockIpAddress}
      />
      <Stack
        direction={isMoreMobile ? "row" : "column"}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          type={"button"}
          disabled={isLoading}
          onClick={() => setRefresh((prev) => !prev)}
        >
          <SyncIcon />
        </IconButton>

        <Search
          fields={[
            {
              name: "IP",
              value: "ipAddress",
            },
            {
              name: "Email",
              value: "email",
            },
          ]}
        />
      </Stack>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange}>
            <Tab label="History" value={"history"} />
            <Tab label="Blocked" value={"block"} />
          </TabList>
        </Box>
      </TabContext>
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

export default TryLogin;
