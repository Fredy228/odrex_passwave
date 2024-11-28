import {
  type FC,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";

import {
  EPrivilegeDirection,
  EPrivilegeList,
  EPrivilegeType,
  Permit,
  PermitEdit,
} from "@/enum/privilege.enum";
import usePrivilegeColumn from "@/components/ui/privileges/privilege-column";
import { DataGrid } from "@mui/x-data-grid";
import usePagination from "@/hooks/use-pagination";
import {
  createOrUpdatePrivilege,
  deletePrivilegeById,
  getAllPrivileges,
} from "@/api/privilege.api";
import { outputError } from "@/services/output-error";
import { PrivilegeItemInterface } from "@/interface/privilege.interface";
import { toast } from "react-toastify";

type Props = {
  list: EPrivilegeList;
  id: number;
};
const PrivilegeList: FC<Props> = ({ list, id }) => {
  const [type, setType] = useState<EPrivilegeType>(EPrivilegeType.USER);
  const columns = usePrivilegeColumn(type);
  const { pageSize, setQuery, queryGet } = usePagination();

  const [listPrivilege, setListPrivilege] = useState<PrivilegeItemInterface[]>(
    [],
  );
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFetching = useRef<boolean>(false);

  const handleChangePrivilege = (
    access: PermitEdit,
    idRow: number,
    privilegeId: number | null,
  ) =>
    new Promise(async (resolve, reject) => {
      if (access === PermitEdit.NOT) {
        if (!privilegeId) return reject();
        try {
          await deletePrivilegeById(privilegeId);
          return resolve(null);
        } catch (e) {
          console.log(e);
          return reject();
        }
      }
      let direction = EPrivilegeDirection.UP;
      let permit: Permit = Permit.READ;
      if ([PermitEdit.EDIT_ALL, PermitEdit.EDIT].includes(access))
        permit = Permit.EDIT;
      if ([PermitEdit.READ_ALL, PermitEdit.READ].includes(access))
        permit = Permit.READ;
      if ([PermitEdit.READ_ALL, PermitEdit.EDIT_ALL].includes(access))
        direction = EPrivilegeDirection.DOWN;
      try {
        await createOrUpdatePrivilege({
          list,
          type,
          id: idRow,
          target_id: id,
          access: permit,
          direction,
        });
        return resolve(permit);
      } catch {
        return reject();
      }
    });

  const handleTabChange = (event: SyntheticEvent, newValue: EPrivilegeType) => {
    setType(newValue);
  };

  const handleProcessRowUpdate = (newRow: any) => {
    const prewRow = listPrivilege.find((row) => row.id === newRow.id);
    if (prewRow?.access === newRow.access) return newRow;
    setListPrivilege((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row)),
    );
    toast.promise(
      handleChangePrivilege(
        newRow.access as PermitEdit,
        newRow.id,
        newRow.privilege_id,
      ),
      {
        pending: "Updating...",
        success: "Updated successful",
        error: "Error request",
      },
    );
    console.log(newRow);
    if (newRow.access === PermitEdit.EDIT_ALL) newRow.access = PermitEdit.EDIT;
    if (newRow.access === PermitEdit.READ_ALL) newRow.access = PermitEdit.READ;
    return newRow;
  };

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    getAllPrivileges({ list, type, id }, queryGet)
      .then((data) => {
        setListPrivilege(data.data);
        setTotal(data.total);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [id, list, queryGet, type]);

  return (
    <>
      <TabContext value={type}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange}>
            <Tab label="Users" value={EPrivilegeType.USER} />
            <Tab label="Groups" value={EPrivilegeType.GROUP} />
          </TabList>
        </Box>
      </TabContext>

      <DataGrid
        sx={{
          margin: "20px 0",
        }}
        rows={listPrivilege}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        pageSizeOptions={[15, 20, 30, 50, 100]}
        disableRowSelectionOnClick
        loading={isLoading}
        rowCount={total}
        editMode="row"
        processRowUpdate={handleProcessRowUpdate}
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

export default PrivilegeList;
