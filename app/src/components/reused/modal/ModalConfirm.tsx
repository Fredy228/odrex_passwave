import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { type FC, useState } from "react";
import { LoadingButton } from "@mui/lab";

import { outputError } from "@/services/output-error";
import { toast } from "react-toastify";

type Props = {
  close: () => void;
  refresh?: () => void;
  id: number | null;
  text: string;
  fetchApi: (id: number) => Promise<void>;
};
const ModalConfirm: FC<Props> = ({ close, refresh, id, text, fetchApi }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!id || isLoading) return;
    setIsLoading(true);

    fetchApi(id)
      .then(() => {
        refresh && refresh();
        toast.success("Success");
        close();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={Boolean(id)} onClose={close}>
      <DialogTitle textAlign={"center"}>{text}</DialogTitle>
      <DialogActions>
        <Button disabled={isLoading} type={"button"} onClick={close}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          type={"button"}
          onClick={handleDelete}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirm;
