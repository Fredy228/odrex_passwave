import React, { type FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { outputError } from "@/services/output-error";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";
import getChangedFields from "@/services/getChangedFieldsSimple";
import { hallUpdateSchema } from "@/validate/hall.schema";
import { HallInterface } from "@/interface/hall.interface";
import { getHallById, updateHall } from "@/api/hall.api";

type Props = {
  close: () => void;
  refresh: () => void;
  id: number | null;
};
const HallUpdate: FC<Props> = ({ close, refresh, id }) => {
  const [name, setName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const isMoreMobile = useMediaQuery("(min-width:768px)");

  const [originalCompany, setOriginalCompany] = useState<HallInterface | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const handleUpdate = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    setErrorFields([]);
    setIsLoading(true);
    if (!originalCompany || !id) return;

    const stateFields = {
      name: name.trim(),
      notes: notes.trim(),
    };

    const changedFields = getChangedFields(
      originalCompany,
      stateFields as HallInterface,
    );
    if (!changedFields) return toast.success("Hall updated successful");

    const { error, value } = hallUpdateSchema.validate(changedFields);

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    updateHall(id, value)
      .then(() => {
        toast.success("Hall updated successful");
        setName("");
        setNotes("");
        close();
        refresh();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    getHallById(id)
      .then((data) => {
        setName(data.name);
        if (data.notes) setNotes(data.notes);
        setOriginalCompany(data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <Dialog open={Boolean(id)} onClose={close} fullWidth={!isMoreMobile}>
      <DialogTitle textAlign={"center"}>Update hall</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleUpdate}>
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
          onClick={() => handleUpdate()}
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default HallUpdate;
