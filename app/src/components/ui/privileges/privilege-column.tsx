import {
  GridCellParams,
  GridColDef,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { Avatar, MenuItem, Select, Stack, Typography } from "@mui/material";

import { BoxCenter } from "@/components/ui/users/users.styled";
import { generateUrlFile } from "@/services/generateUrlFile";
import { EPrivilegeType, PermitEdit } from "@/enum/privilege.enum";

const usePrivilegeColumn = (type: EPrivilegeType): GridColDef[] => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, editable: false },
    {
      field: "name",
      headerName: "User name",
      width: 180,
      editable: false,
    },
  ];

  if (type === EPrivilegeType.USER)
    columns.push(
      {
        field: "email",
        headerName: "Email",
        width: 200,
        editable: false,
        sortable: false,
      },
      {
        field: "role",
        headerName: "Role",
        type: "string",
        width: 100,
        editable: false,
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
    );

  columns.push({
    field: "access",
    headerName: "Access",
    width: 150,
    editable: true,
    sortable: false,
    renderCell: (params: GridCellParams) => (
      <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
        <Typography alignItems={"center"} fontWeight={600}>
          {(params.value as string) || PermitEdit.NOT}
        </Typography>
      </Stack>
    ),
    renderEditCell: (params: GridRenderEditCellParams) => (
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={params.value || PermitEdit.NOT}
        variant={"outlined"}
        onChange={(event) => {
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: event.target.value,
          });
        }}
        fullWidth
        label="Role"
      >
        {Object.values(PermitEdit).map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    ),
  });

  return columns;
};

export default usePrivilegeColumn;
