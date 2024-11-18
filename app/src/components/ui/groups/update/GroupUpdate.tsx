import React, { type FC, useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

import { GroupInterface } from "@/interface/group.interface";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";
import { updateGroup } from "@/api/group.api";
import { groupUpdateSchema } from "@/validate/group.schema";
import { outputError } from "@/services/output-error";

type Props = {
  group: GroupInterface | null;
  close: () => void;
  refresh: () => void;
};
const GroupUpdate: FC<Props> = ({ group, close, refresh }) => {
  const [name, setName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);
  const isStart = useRef<boolean>(false);

  const handleClose = () => {
    isStart.current = false;
    close();
  };

  const handleUpdate = (event?: React.FormEvent<HTMLFormElement>) => {
    if (!group) return;
    if (event) event.preventDefault();
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = groupUpdateSchema.validate({
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

    updateGroup(group.id, value)
      .then(() => {
        setName("");
        refresh();
        close();
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isStart.current) return;

    if (group) {
      isStart.current = true;
      setName(group.name);
    }
  }, [group]);

  return (
    <Dialog open={Boolean(group)} onClose={close}>
      <DialogTitle textAlign={"center"}>Update new group</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleUpdate}>
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
        <Button disabled={isLoading} type={"button"} onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          type={"button"}
          onClick={() => handleUpdate()}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default GroupUpdate;
