import React, { type FC } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { EPrivilegeList } from "@/enum/privilege.enum";
import PrivilegeList from "@/components/ui/privileges/PrivilegeList";
import Search from "@/components/reused/search/Search";

type Props = {
  listType: EPrivilegeList;
  id: number | null;
  title: string;
  close: () => void;
};
const Privileges: FC<Props> = ({ id, listType, close, title }) => {
  return (
    <Dialog open={Boolean(id)} onClose={close} fullScreen>
      <DialogTitle textAlign={"center"}>{title}</DialogTitle>
      <DialogContent>
        <Search
          fields={[
            {
              name: "Name",
              value: "name",
            },
            {
              name: "Email",
              value: "email",
            },
          ]}
        />
        {id && <PrivilegeList list={listType} id={id} />}
      </DialogContent>
      <DialogActions>
        <Button type={"button"} onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Privileges;
