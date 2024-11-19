import { useState } from "react";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import { Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

import { BoxCenter } from "@/components/ui/users/users.styled";
import { generateUrlFile } from "@/services/generateUrlFile";
import { GroupInterface } from "@/interface/group.interface";
import { addRemoveUserGroup } from "@/api/group.api";
import { outputError } from "@/services/output-error";

type Props = {
  type?: "list" | "add";
  refresh: () => void;
  group: GroupInterface;
};
const useGroupUsersColumns = ({ type = "list", group, refresh }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddRemove = (action: "add" | "remove", id: number) => {
    if (isLoading)
      return toast.warning("Wait until the current request is processed");
    setIsLoading(true);
    addRemoveUserGroup(action, group.id, id)
      .then(() => {
        refresh();
        toast.success(`Successfully ${action}`);
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
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
          <IconButton
            type={"button"}
            onClick={() => handleAddRemove("add", params.row.id)}
          >
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
            onClick={() => handleAddRemove("remove", params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </BoxCenter>
      ),
    });

  return {
    columns,
  };
};

export default useGroupUsersColumns;
