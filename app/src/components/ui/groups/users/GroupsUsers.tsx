import React, { type FC } from "react";

import { GroupInterface } from "@/interface/group.interface";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import GroupUsersContent from "@/components/ui/groups/users/GroupUsersContent";

type Props = {
  group: GroupInterface | null;
  close: () => void;
};
const GroupsUsers: FC<Props> = ({ close, group }) => {
  return (
    <Dialog open={Boolean(group)} onClose={close} fullScreen>
      <DialogTitle textAlign={"center"}>{group?.name}</DialogTitle>
      <DialogContent>
        {group && <GroupUsersContent group={group} />}
      </DialogContent>
      <DialogActions>
        <Button type={"button"} onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupsUsers;
