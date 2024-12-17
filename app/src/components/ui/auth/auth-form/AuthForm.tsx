import { type FC, FormEventHandler, useState } from "react";
import { set } from "local-storage";
import { toast } from "react-toastify";
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import useUserStore from "@/global-state/user.store";
import { userLoginSchema } from "@/validate/auth.schema";
import { loginUser } from "@/api/auth";
import { outputError } from "@/services/output-error";
import { BoxIcon, FormContainer, FormCustom } from "./auth-form.styled";

const AuthForm: FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const setUser = useUserStore((state) => state.setUser);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMousePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = userLoginSchema.validate({
      password,
      email,
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

    loginUser(value)
      .then((data) => {
        if (data.accessToken) set("token", data.accessToken);
        setUser(data);
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <FormContainer>
      <BoxIcon>
        <LockOutlinedIcon
          sx={{
            width: "30px",
            height: "30px",
            color: "#fff",
          }}
        />
      </BoxIcon>
      <Typography variant={"h2"} marginBottom={"10px"}>
        Sign in
      </Typography>
      <Typography variant={"body1"} marginBottom={"10px"} fontSize={"small"}>
        Welcome user, please sign in to continue
      </Typography>
      <FormCustom noValidate onSubmit={handleSubmitForm}>
        <TextField
          fullWidth
          id="email"
          label="Email address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errorFields.includes("email")}
        />
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errorFields.includes("password")}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMousePassword}
                  onMouseUp={handleMousePassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <Link href={"/auth/forgot"}>Forgot password? Go to</Link>

        <LoadingButton
          loading={isLoading}
          fullWidth
          variant="contained"
          type={"submit"}
        >
          Sign in
        </LoadingButton>
      </FormCustom>
    </FormContainer>
  );
};

export default AuthForm;
