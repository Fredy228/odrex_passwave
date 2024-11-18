import React, { type FC, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { outputError } from "@/services/output-error";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";
import { createGroup } from "@/api/group.api";
import { groupSchema } from "@/validate/group.schema";

type Props = {
  isShow: boolean;
  close: () => void;
  refresh: () => void;
};
const GroupCreate: FC<Props> = ({ close, refresh, isShow }) => {
  const [name, setName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const handleCreate = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = groupSchema.validate({
      name,
    });

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    createGroup({ name: value.name })
      .then(() => {
        toast.success("Group created successful");
        setName("");
        close();
        refresh();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={isShow} onClose={close}>
      <DialogTitle textAlign={"center"}>Create new group</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleCreate}>
          <TextField
            fullWidth
            id="name"
            label="Group name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errorFields.includes("name")}
          />
        </FormCustom>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} type={"button"} onClick={close}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          type={"button"}
          onClick={() => handleCreate()}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default GroupCreate;
