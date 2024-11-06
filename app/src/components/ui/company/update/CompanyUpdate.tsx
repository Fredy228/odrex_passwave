import React, { type FC, useEffect, useState } from "react";
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

import { companyUpdateSchema } from "@/validate/company.schema";
import { getCompanyById, updateCompany } from "@/api/company.api";
import { outputError } from "@/services/output-error";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";
import { CompanyInterface } from "@/interface/company.interface";
import getChangedFields from "@/services/getChangedFieldsSimple";

type Props = {
  close: () => void;
  refresh: () => void;
  id: number | null;
};
const CompanyUpdate: FC<Props> = ({ close, refresh, id }) => {
  const [name, setName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [originalCompany, setOriginalCompany] =
    useState<CompanyInterface | null>(null);

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
      stateFields as CompanyInterface,
    );
    if (!changedFields) return toast.success("Company updated successful");

    const { error, value } = companyUpdateSchema.validate(changedFields);

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    updateCompany(id, value)
      .then(() => {
        toast.success("Company updated successful");
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

    getCompanyById(id)
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
    <Dialog open={Boolean(id)} onClose={close}>
      <DialogTitle textAlign={"center"}>Update company</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleUpdate}>
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
          onClick={() => handleUpdate()}
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyUpdate;
