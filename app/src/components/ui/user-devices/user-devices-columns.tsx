import { useState } from "react";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { BoxCenter } from "@/components/ui/users/users.styled";

const useUserDevicesColumns = () => {
  const [deleteSession, setDeleteSession] = useState<number | null>(null);

  const columns: GridColDef[] = [
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
      field: "updateAt",
      headerName: "Date update",
      sortable: false,
      editable: false,
      filterable: false,
      width: 185,
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <Typography>
            {dayjs(params.row.updateAt).format("YYYY-MM-DD HH:mm:ss")}
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
            onClick={() => setDeleteSession(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </BoxCenter>
      ),
    },
  ];

  return {
    columns,
    deleteSession,
    setDeleteSession,
  };
};

export default useUserDevicesColumns;
