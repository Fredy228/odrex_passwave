import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import { Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { generateUrlFile } from "@/services/generateUrlFile";
import { BoxCenter } from "@/components/ui/users/users.styled";
import useActionStore from "@/global-state/action.store";

const useUserColumns = (): GridColDef[] => {
  const setDeleteUser = useActionStore((state) => state.setDeleteUser);

  return [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "User name",
      width: 200,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      editable: false,
      sortable: false,
    },
    {
      field: "role",
      headerName: "Role",
      type: "string",
      width: 100,
      editable: true,
      sortable: false,
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
    {
      field: "del",
      headerName: "Del",
      sortable: false,
      editable: false,
      type: "actions",
      renderCell: (params: GridCellParams) => (
        <BoxCenter>
          <IconButton
            type={"button"}
            onClick={() => setDeleteUser(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </BoxCenter>
      ),
    },
  ];
};
export default useUserColumns;
