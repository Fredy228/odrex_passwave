import React, { type FC } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { DeviceInterface } from "@/interface/device.interface";
import Password from "@/components/ui/password/Password";
import useUserStore from "@/global-state/user.store";
import { RoleEnum } from "@/enum/role.enum";

type Props = {
  device: DeviceInterface | null;
  close: () => void;
  openDelete: () => void;
  openEdit: () => void;
};
const DeviceOpen: FC<Props> = ({ device, close, openDelete, openEdit }) => {
  const user = useUserStore((state) => state.user);

  return (
    <Dialog open={Boolean(device?.id)} onClose={close} fullScreen>
      <DialogTitle textAlign={"center"}>
        {device?.name} ({device?.interface || "–"})
      </DialogTitle>
      <DialogContent>{device?.id && <Password id={device.id} />}</DialogContent>
      <DialogActions>
        {user?.role === RoleEnum.ADMIN && (
          <>
            <Button
              type={"button"}
              startIcon={<DeleteIcon />}
              onClick={() => openDelete()}
            >
              Delete
            </Button>
            <Button
              type={"button"}
              startIcon={<EditIcon />}
              onClick={() => openEdit()}
            >
              Edit
            </Button>
          </>
        )}

        <Button type={"button"} onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceOpen;
