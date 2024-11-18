import { ChangeEvent, type FC, useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, FormControlLabel, Stack, Switch } from "@mui/material";

import { GroupInterface } from "@/interface/group.interface";
import { UserInterface } from "@/interface/user.interface";
import useGroupUsersColumns from "@/components/ui/groups/users/group-users-colums";
import usePagination from "@/hooks/use-pagination";
import { getAllUsers } from "@/api/user.api";
import { outputError } from "@/services/output-error";
import Search from "@/components/reused/search/Search";

type Props = {
  group: GroupInterface;
};
const GroupUsersContent: FC<Props> = ({ group }) => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const { columns, deleteGroupUser, setDeleteGroupUser } = useGroupUsersColumns(
    { type: "list", refresh: () => setRefresh((prev) => !prev) },
  );
  const { page, sort, pageSize, setQuery, queryGet } = usePagination();

  const [listUser, setListUser] = useState<UserInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isOnlyGroup, setIsOnlyGroup] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsOnlyGroup(event.target.checked);
  };

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    getAllUsers({
      ...queryGet,
      filter: {
        privilege_groups: {
          id: group.id,
        },
      },
    })
      .then((data) => {
        console.log("data: ", data);
        setTotal(data.total);
        setListUser(data.data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [pageSize, sort, page, refresh, queryGet, group]);

  return (
    <>
      <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
        <Button variant={"contained"} onClick={() => setIsOnlyGroup(false)}>
          Add mode
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={isOnlyGroup}
              onChange={handleSwitchChange}
              name="only-group"
            />
          }
          label="Only in group"
        />
        <Search
          fields={[
            {
              name: "Name",
              value: "name",
            },
            {
              name: "Entry",
              value: "entry",
            },
            {
              name: "Access",
              value: "access",
            },
          ]}
        />
      </Stack>
      <DataGrid
        sx={{
          margin: "20px 0",
        }}
        rows={listUser}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        pageSizeOptions={[15, 20, 30, 50, 100]}
        checkboxSelection
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

export default GroupUsersContent;
