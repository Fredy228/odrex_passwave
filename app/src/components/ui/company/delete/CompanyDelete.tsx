import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { type FC, useState } from "react";
import { LoadingButton } from "@mui/lab";

import { deleteCompanyById } from "@/api/company.api";
import { outputError } from "@/services/output-error";

type Props = {
  close: () => void;
  refresh: () => void;
  id: number | null;
};
const CompanyDelete: FC<Props> = ({ close, refresh, id }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!id || isLoading) return;
    setIsLoading(true);

    deleteCompanyById(id)
      .then(() => {
        refresh();
        close();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={Boolean(id)} onClose={close}>
      <DialogTitle textAlign={"center"}>
        Are you sure you want to delete the company?
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

export default CompanyDelete;
