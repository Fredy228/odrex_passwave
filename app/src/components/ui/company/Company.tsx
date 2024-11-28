import React, { type FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";

import usePagination from "@/hooks/use-pagination";
import { getAllCompanies } from "@/api/company.api";
import { outputError } from "@/services/output-error";
import { CompanyInterface } from "@/interface/company.interface";
import useUserStore from "@/global-state/user.store";
import { RoleEnum } from "@/enum/role.enum";
import CompanyCreate from "@/components/ui/company/create/CompanyCreate";
import {
  ButtonCircleRight,
  ButtonCreate,
} from "@/components/reused/button/button-create.styled";
import {
  Item,
  ItemContent,
  List,
} from "@/components/reused/plate-list/plate-item.styled";
import { scrollToTop } from "@/services/scroll-to-top";
import Box from "@mui/material/Box";
import CompanyDelete from "@/components/ui/company/delete/CompanyDelete";
import CompanyUpdate from "@/components/ui/company/update/CompanyUpdate";

const Company: FC = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [list, setListCompany] = useState<CompanyInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [deleteCompany, setDeleteCompany] = useState<number | null>(null);
  const [updateCompany, setUpdateCompany] = useState<number | null>(null);

  const { page, pageSize, setQuery, queryGet } = usePagination();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const onItemClick = (id: number) => {
    navigate(`/company/${id}`);
  };

  const handleSetPage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setQuery([{ field: "page", value: String(value) }]);
    scrollToTop();
  };

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    getAllCompanies(queryGet)
      .then((data) => {
        console.log("data", data);
        setTotal(data.total);
        setListCompany(data.data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [refresh, queryGet]);

  return (
    <>
      <CompanyCreate
        close={() => setIsShowModalCreate(false)}
        isShow={isShowModalCreate}
        refresh={() => setRefresh((prev) => !prev)}
      />
      <CompanyUpdate
        id={updateCompany}
        close={() => setUpdateCompany(null)}
        refresh={() => setRefresh((prev) => !prev)}
      />
      <CompanyDelete
        id={deleteCompany}
        close={() => setDeleteCompany(null)}
        refresh={() => setRefresh((prev) => !prev)}
      />
      {user?.role === RoleEnum.ADMIN && (
        <ButtonCreate onClick={() => setIsShowModalCreate(true)}>
          <AddIcon />
        </ButtonCreate>
      )}
      <List>
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((i) => (
              <Item elevation={3} key={i} sx={{ padding: "50px 25px" }}>
                <Skeleton variant={"circular"} width={35} height={35} />
                <Skeleton variant={"text"} width={"100%"} />
              </Item>
            ))
          : list.map((item) => (
              <Item key={item.id} elevation={3}>
                <ItemContent onClick={() => onItemClick(item.id)}>
                  <BusinessIcon />
                  <Typography fontWeight={600} fontSize={"large"}>
                    {item.name}
                  </Typography>
                </ItemContent>
                {user?.role === RoleEnum.ADMIN && (
                  <Stack
                    direction={"row"}
                    spacing={0}
                    title={"action"}
                    position={"absolute"}
                    zIndex={200}
                    sx={{ top: "10px", right: "10px" }}
                  >
                    <IconButton
                      type={"button"}
                      onClick={() => setUpdateCompany(item.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      type={"button"}
                      onClick={() => setDeleteCompany(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </Item>
            ))}
      </List>
      {!list.length && !isLoading && (
        <Typography mt={2} fontWeight={600} textAlign={"center"}>
          The list of companies is empty
        </Typography>
      )}

      {Math.ceil(total / pageSize) > 1 && !isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            sx={{
              margin: "25px 0",
            }}
            count={Math.ceil(total / pageSize)}
            page={page}
            onChange={handleSetPage}
          />
        </Box>
      )}
    </>
  );
};

export default Company;
