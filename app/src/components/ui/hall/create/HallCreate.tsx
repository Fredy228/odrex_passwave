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
import { hallSchema } from "@/validate/hall.schema";
import { createHall } from "@/api/hall.api";

type Props = {
  isShow: boolean;
  close: () => void;
  refresh: () => void;
  id: number | undefined;
};
const HallCreate: FC<Props> = ({ close, refresh, isShow, id }) => {
  const [name, setName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const handleCreate = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!id) return;
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = hallSchema.validate({
      name,
      notes: notes.trim() || null,
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

    createHall({ name: value.name, notes: value.notes }, id)
      .then(() => {
        toast.success("Hall created successful");
        setName("");
        setNotes("");
        close();
        refresh();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={isShow} onClose={close}>
      <DialogTitle textAlign={"center"}>Create new hall</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleCreate}>
          <TextField
            fullWidth
            id="name"
            label="Hall name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errorFields.includes("name")}
          />
          <TextField
            fullWidth
            id="notes"
            label="Hall notes"
            variant="outlined"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            error={errorFields.includes("notes")}
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

export default HallCreate;
