import { useState } from "react";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import { Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { BoxCenter } from "@/components/ui/users/users.styled";
import { generateUrlFile } from "@/services/generateUrlFile";

type Props = {
  type?: "list" | "add";
  refresh: () => void;
};
const useGroupUsersColumns = ({ type = "list" }: Props) => {
  const [deleteGroupUser, setDeleteGroupUser] = useState<number | null>(null);

  const handleAdd = (id: number) => {};

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      sortable: false,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      sortable: false,
      editable: false,
    },
    {
      field: "role",
      headerName: "Role",
      width: 180,
      sortable: false,
      editable: false,
    },
    {
      field: "avatarUrl",
      headerName: "Avatar",
      sortable: false,
      editable: false,
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <Avatar
            src={generateUrlFile(params.value as string)}
            alt={"User avatar"}
          />
        </BoxCenter>
      ),
    },
  ];

  if (type === "add")
    columns.push({
      field: "add",
      headerName: "Add",
      sortable: false,
      editable: false,
      width: 40,
      type: "actions",
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <IconButton type={"button"} onClick={() => handleAdd(params.row.id)}>
            <AddIcon />
          </IconButton>
        </BoxCenter>
      ),
    });

  if (type === "list")
    columns.push({
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
            onClick={() => setDeleteGroupUser(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </BoxCenter>
      ),
    });

  return {
    columns,
    deleteGroupUser,
    setDeleteGroupUser,
  };
};

export default useGroupUsersColumns;
