import { type FC, useState } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import useActionStore from "@/global-state/action.store";
import { deleteUserById } from "@/api/user.api";
import { outputError } from "@/services/output-error";

type Props = {
  isShow: boolean;
  close: () => void;
  refresh: () => void;
};
const UserDelete: FC<Props> = ({ isShow, close, refresh }) => {
  const deleteUserId = useActionStore((state) => state.deleteUserId);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = () => {
    if (!deleteUserId || isLoading) return;
    setIsLoading(true);

    deleteUserById(deleteUserId)
      .then(() => {
        refresh();
        close();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={isShow} onClose={close}>
      <DialogTitle textAlign={"center"}>
        Are you sure you want to delete the user?
      </DialogTitle>
      <DialogActions>
        <Button disabled={isLoading} type={"button"} onClick={close}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          type={"button"}
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UserDelete;
