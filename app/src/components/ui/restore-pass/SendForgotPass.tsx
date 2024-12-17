import React, { type FC, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { FormCustom } from "@/components/reused/form/form-create-custom.styled";
import { emailSchema } from "@/validate/auth.schema";
import { sendForgotPassword } from "@/api/auth";
import { outputError } from "@/services/output-error";

const SendForgotPass: FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = emailSchema.validate({ email });

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    sendForgotPassword(value.email)
      .then(() => {
        toast.success("Successfully sent");
        toast.success("Check our email");
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <FormCustom onSubmit={handleSend}>
        <TextField
          fullWidth
          id="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errorFields.includes("email")}
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
            type={"submit"}
            variant="contained"
          >
            Send
          </LoadingButton>
        </Stack>
      </FormCustom>
    </>
  );
};

export default SendForgotPass;
