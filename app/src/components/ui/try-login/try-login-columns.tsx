import { useState } from "react";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { BoxCenter } from "@/components/ui/users/users.styled";
import dayjs from "dayjs";

const useTryLoginColumns = (tab: "history" | "block") => {
  const [deleteHistory, setDeleteHistory] = useState<number | null>(null);
  const [unblock, setUnblock] = useState<string | null>(null);

  const columnsHistory: GridColDef[] = [
    {
      field: "ipAddress",
      headerName: "Ip address",
      width: 180,
      sortable: false,
      editable: false,
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      sortable: false,
      editable: false,
      filterable: false,
    },
    {
      field: "isEmailTrue",
      headerName: "Exist",
      sortable: false,
      editable: false,
      filterable: false,
      width: 70,
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          {params.row.isEmailTrue ? <CheckIcon /> : <CloseIcon />}
        </BoxCenter>
      ),
    },
    {
      field: "deviceModel",
      headerName: "Device",
      width: 250,
      sortable: false,
      editable: false,
      filterable: false,
    },
    {
      field: "createAt",
      headerName: "Date create",
      sortable: false,
      editable: false,
      filterable: false,
      width: 185,
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <Typography>
            {dayjs(params.row.createAt).format("YYYY-MM-DD HH:mm:ss")}
          </Typography>
        </BoxCenter>
      ),
    },
    {
      field: "del",
      headerName: "Del",
      sortable: false,
      editable: false,
      width: 40,
      type: "actions",
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <IconButton
            type={"button"}
            onClick={() => setDeleteHistory(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </BoxCenter>
      ),
    },
  ];

  const columnsBlocked: GridColDef[] = [
    {
      field: "ipAddress",
      headerName: "Ip address",
      width: 180,
      sortable: false,
      editable: false,
      filterable: false,
    },
    {
      field: "deviceModel",
      headerName: "Device",
      width: 250,
      sortable: false,
      editable: false,
      filterable: false,
    },
    {
      field: "createAt",
      headerName: "Date create",
      sortable: false,
      editable: false,
      filterable: false,
      width: 185,
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <Typography>
            {dayjs(params.row.createAt).format("YYYY-MM-DD HH:mm:ss")}
          </Typography>
        </BoxCenter>
      ),
    },
    {
      field: "del",
      headerName: "Del",
      sortable: false,
      editable: false,
      width: 40,
      type: "actions",
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <IconButton
            type={"button"}
            onClick={() => setUnblock(params.row.ipAddress)}
          >
            <DeleteIcon />
          </IconButton>
        </BoxCenter>
      ),
    },
  ];

  return {
    columns: tab === "history" ? columnsHistory : columnsBlocked,
    deleteHistory,
    setDeleteHistory,
    unblock,
    setUnblock,
  };
};

export default useTryLoginColumns;
