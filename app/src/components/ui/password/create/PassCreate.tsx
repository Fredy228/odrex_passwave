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
import { getExistValue } from "@/services/getExistValue";
import { createPass } from "@/api/password.api";
import { passSchema } from "@/validate/pass.schema";
import ButtonInput from "@/components/reused/button/ButtonInput";

type Props = {
  isShow: boolean;
  close: () => void;
  refresh: () => void;
  id: number | null;
};
const PassCreate: FC<Props> = ({ close, refresh, isShow, id }) => {
  const [name, setName] = useState<string>("");
  const [entry, setEntry] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [access, setAccess] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const handleCreate = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!id) return;
    setErrorFields([]);
    setIsLoading(true);

    const existValue = getExistValue({
      name,
      entry,
      address,
      access,
      login,
      password,
      notes,
    });

    const { error, value } = passSchema.validate(existValue);

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    createPass({ ...value }, files, id)
      .then(() => {
        toast.success("Pass created successful");
        setName("");
        setEntry("");
        setAddress("");
        setAccess("");
        setLogin("");
        setPassword("");
        setNotes("");
        setFiles([]);
        close();
        refresh();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={isShow} onClose={close}>
      <DialogTitle textAlign={"center"}>Create new pass</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleCreate}>
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

          <ButtonInput files={files} setFile={setFiles} />
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

export default PassCreate;
