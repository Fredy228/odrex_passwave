import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import { IconButton, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard as ReactCopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import SettingsIcon from "@mui/icons-material/Settings";

import { BoxCenter } from "@/components/ui/users/users.styled";
import { PasswordInterface } from "@/interface/password.interface";

const usePassColumns = () => {
  const [deletePass, setDeletePass] = useState<number | null>(null);
  const [editPass, setEditPass] = useState<number | null>(null);
  const [privilegeShow, setPrivilegeShow] = useState<PasswordInterface | null>(
    null,
  );
  const [isShowMore, setIsShowMore] = useState<number | null>(null);

  const handleCopyPass = (result: boolean) => {
    if (result) toast.success("Password copied to clipboard");
    else toast.error("Password didn't copied to clipboard");
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 180,
      sortable: false,
      editable: false,
    },
    {
      field: "entry",
      headerName: "Entry",
      width: 180,
      editable: false,
      sortable: false,
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      field: "access",
      headerName: "Access",
      width: 180,
      editable: false,
      sortable: false,
    },
    {
      field: "login",
      headerName: "Login",
      width: 180,
      editable: false,
      sortable: false,
    },
    {
      field: "password",
      headerName: "Password",
      width: 220,
      sortable: false,
      editable: false,
      type: "actions",
      renderCell: (params: GridCellParams) => (
        <Stack direction={"row"} spacing={2}>
          <TextField variant={"standard"} value={params.row.password || ""} />
          <ReactCopyToClipboard
            text={params.row.password}
            onCopy={(_, result) => handleCopyPass(result)}
          >
            <IconButton type={"button"}>
              <ContentCopyIcon />
            </IconButton>
          </ReactCopyToClipboard>
        </Stack>
      ),
    },
    {
      field: "more",
      headerName: "More",
      sortable: false,
      editable: false,
      width: 70,
      type: "actions",
      renderCell: (params: GridCellParams) => {
        if (
          !params.row.notes &&
          (!params.row.files || params.row.files?.length < 1)
        )
          return "";

        return (
          <BoxCenter>
            <IconButton
              type={"button"}
              onClick={() => setIsShowMore(params.row.id)}
            >
              <ReadMoreIcon />
            </IconButton>
          </BoxCenter>
        );
      },
    },
    {
      field: "privilege",
      headerName: "Privilege",
      sortable: false,
      editable: false,
      width: 40,
      type: "actions",
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <IconButton
            type={"button"}
            onClick={() => setPrivilegeShow(params.row)}
          >
            <SettingsIcon />
          </IconButton>
        </BoxCenter>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      editable: false,
      width: 40,
      type: "actions",
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <IconButton
            type={"button"}
            onClick={() => setEditPass(params.row.id)}
          >
            <EditIcon />
          </IconButton>
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
            onClick={() => setDeletePass(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </BoxCenter>
      ),
    },
  ];

  return {
    columns,
    deletePass,
    setDeletePass,
    editPass,
    setEditPass,
    isShowMore,
    setIsShowMore,
    privilegeShow,
    setPrivilegeShow,
  };
};
export default usePassColumns;
