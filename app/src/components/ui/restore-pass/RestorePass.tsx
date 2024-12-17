import React, { type FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";
import { Button, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { passSchema } from "@/validate/auth.schema";
import { toast } from "react-toastify";
import { restorePassword } from "@/api/auth";
import { outputError } from "@/services/output-error";

const RestorePass: FC = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");

  const isSamePass = password === rePassword;

  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!key) return;
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = passSchema.validate({ password });

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    restorePassword(key, value.password)
      .then(() => {
        toast.success("Password restored successfully");
        navigate("/auth/login");
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };
  return (
    <>
      <FormCustom onSubmit={handleSend}>
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
          id="rePassword"
          label="Repeat password"
          variant="outlined"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          error={errorFields.includes("password")}
        />
        <Stack direction={"row"} spacing={2}>
          <Button
            disabled={isLoading}
            type={"button"}
            variant="outlined"
            fullWidth
            onClick={() => navigate("/auth/login")}
          >
            Return to login
          </Button>
          <LoadingButton
            loading={isLoading}
            disabled={!isSamePass}
            type={"submit"}
            variant="contained"
          >
            Restore
          </LoadingButton>
        </Stack>
      </FormCustom>
    </>
  );
};

export default RestorePass;
