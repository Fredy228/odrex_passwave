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

import { outputError } from "@/services/output-error";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";
import {
  deleteFilePassById,
  getPassById,
  updatePass,
} from "@/api/password.api";
import { passUpdateSchema } from "@/validate/pass.schema";
import getChangedFields from "@/services/getChangedFieldsSimple";
import { IFilesPass, PasswordInterface } from "@/interface/password.interface";
import ButtonInput from "@/components/reused/button/ButtonInput";

type Props = {
  close: () => void;
  refresh: () => void;
  id: number | null;
};
const PassUpdate: FC<Props> = ({ close, refresh, id }) => {
  const [name, setName] = useState<string>("");
  const [entry, setEntry] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [access, setAccess] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [filesUploaded, setFilesUploaded] = useState<Array<IFilesPass>>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);
  const [originalPass, setOriginalPass] = useState<PasswordInterface | null>(
    null,
  );

  const handleUpdate = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!id || !originalPass) return;
    setErrorFields([]);
    setIsLoading(true);

    const stateFields = {
      name,
      entry,
      address,
      access,
      login,
      password,
      notes,
    };

    const changedFields = getChangedFields(
      originalPass,
      stateFields as PasswordInterface,
    );
    if (!changedFields && !files.length) {
      setIsLoading(false);
      close();
      return toast.success("Pass updated successful");
    }

    const { error, value } = passUpdateSchema.validate(changedFields || {});

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    updatePass(id, { ...value }, files)
      .then(() => {
        toast.success("Pass updated successful");
        setFiles([]);
        close();
        refresh();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  const handleFileDelete = (key: string) => {
    if (!id) return;
    setIsLoading(true);

    deleteFilePassById(id, key)
      .then(() => {
        setFilesUploaded((prevState) =>
          prevState.filter((i) => i.file_key !== key),
        );
        toast.success("File delete successful");
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    getPassById(id)
      .then((data) => {
        setName(data.name);
        setNotes(data.notes || "");
        setEntry(data.entry || "");
        setAddress(data.address || "");
        setAccess(data.access || "");
        setLogin(data.login || "");
        setPassword(data.password || "");
        setFilesUploaded(data.files || []);
        setOriginalPass(data);
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <Dialog open={Boolean(id)} onClose={close}>
      <DialogTitle textAlign={"center"}>Update new pass</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleUpdate}>
          <TextField
            fullWidth
            id="name"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errorFields.includes("name")}
          />
          <TextField
            fullWidth
            id="entry"
            label="Entry"
            variant="outlined"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            error={errorFields.includes("entry")}
          />
          <TextField
            fullWidth
            id="address"
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errorFields.includes("address")}
          />
          <TextField
            fullWidth
            id="access"
            label="Access"
            variant="outlined"
            value={access}
            onChange={(e) => setAccess(e.target.value)}
            error={errorFields.includes("access")}
          />
          <TextField
            fullWidth
            id="login"
            label="Login"
            variant="outlined"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            error={errorFields.includes("login")}
          />
          <TextField
            fullWidth
            id="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errorFields.includes("password")}
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

          <ButtonInput
            files={files}
            setFile={setFiles}
            filesUploaded={filesUploaded}
            deleteUploaded={handleFileDelete}
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

export default PassUpdate;
