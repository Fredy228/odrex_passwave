import { type FC, useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import UserCreate from "@/components/ui/users/create/UserCreate";
import { MainBox } from "@/components/ui/users/users.styled";
import { UserInterface } from "@/interface/user.interface";
import { QueryGetType } from "@/types/query.type";
import usePagination from "@/hooks/use-pagination";
import { getAllUsers } from "@/api/user.api";
import { outputError } from "@/services/output-error";
import useUserColumns from "@/components/ui/users/users-colums";
import useActionStore from "@/global-state/action.store";
import UserDelete from "@/components/ui/users/delete/UserDelete";
import { ButtonCreate } from "@/components/reused/button/button-create.styled";

const Users: FC = () => {
  const [listUser, setListUser] = useState<UserInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const deleteUserId = useActionStore((state) => state.deleteUserId);
  const setDeleteUser = useActionStore((state) => state.setDeleteUser);

  const { page, sort, pageSize, setQuery } = usePagination();
  const columns = useUserColumns();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    const options: QueryGetType = {
      range: [page * pageSize - pageSize + 1, page * pageSize],
    };
    if (sort) options.sort = sort;

    getAllUsers(options)
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
  }, [pageSize, sort, page, refresh]);

  return (
    <MainBox>
      <UserCreate
        close={() => setIsShowModalCreate(false)}
        isShow={isShowModalCreate}
        refresh={() => setRefresh((prev) => !prev)}
      />
      <UserDelete
        close={() => setDeleteUser(null)}
        isShow={Boolean(deleteUserId)}
        refresh={() => setRefresh((prev) => !prev)}
      />
      <ButtonCreate onClick={() => setIsShowModalCreate(true)}>
        <AddIcon />
      </ButtonCreate>
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
        onRowClick={(params) => navigate(`/users/${params.row.id}`)}
        onPaginationModelChange={(params) => {
          setQuery([
            { field: "page", value: String(params.page + 1) },
            { field: "size", value: String(params.pageSize) },
          ]);
        }}
      />
    </MainBox>
  );
};

export default Users;
