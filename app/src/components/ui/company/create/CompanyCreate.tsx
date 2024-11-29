import React, { type FC, useCallback, useState } from "react";
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

import { companySchema } from "@/validate/company.schema";
import { createCompany } from "@/api/company.api";
import { outputError } from "@/services/output-error";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";

type Props = {
  isShow: boolean;
  close: () => void;
  refresh: () => void;
};
const CompanyCreate: FC<Props> = ({ close, refresh, isShow }) => {
  const [name, setName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const isMoreMobile = useMediaQuery("(min-width:768px)");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const handleCreate = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = companySchema.validate({
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

    createCompany({ name: value.name, notes: value.notes })
      .then(() => {
        toast.success("Company created successful");
        setName("");
        setNotes("");
        close();
        refresh();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={isShow} onClose={close} fullWidth={!isMoreMobile}>
      <DialogTitle textAlign={"center"}>Create new company</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleCreate}>
          <TextField
            fullWidth
            id="name"
            label="Company name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errorFields.includes("name")}
          />
          <TextField
            fullWidth
            id="notes"
            label="Company notes"
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

export default CompanyCreate;
