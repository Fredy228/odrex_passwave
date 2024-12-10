import { useState } from "react";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";

import { BoxCenter } from "@/components/ui/users/users.styled";
import { GroupInterface } from "@/interface/group.interface";

const useGroupColumns = () => {
  const [deleteGroup, setDeleteGroup] = useState<number | null>(null);
  const [editGroup, setEditGroup] = useState<GroupInterface | null>(null);
  const [usersGroup, setUsersGroup] = useState<GroupInterface | null>(null);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      sortable: false,
      editable: false,
    },
    {
      field: "users",
      headerName: "Users",
      sortable: false,
      editable: false,
      width: 60,
      type: "actions",
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <IconButton type={"button"} onClick={() => setUsersGroup(params.row)}>
            <PeopleIcon />
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
          <IconButton type={"button"} onClick={() => setEditGroup(params.row)}>
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
            onClick={() => setDeleteGroup(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </BoxCenter>
      ),
    },
  ];

  return {
    columns,
    editGroup,
    setEditGroup,
    deleteGroup,
    setDeleteGroup,
    usersGroup,
    setUsersGroup,
  };
};

export default useGroupColumns;
