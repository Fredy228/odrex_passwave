import { type FC, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { RoleEnum } from "@/enum/role.enum";
import { LoadingButton } from "@mui/lab";
import { userRegisterSchema } from "@/validate/auth.schema";
import { toast } from "react-toastify";
import { createUser } from "@/api/user.api";
import { outputError } from "@/services/output-error";
import { generateAvatar } from "@/services/generate-avatar";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";

type Props = {
  isShow: boolean;
  close: () => void;
  refresh: () => void;
};
const UserCreate: FC<Props> = ({ isShow, close, refresh }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<RoleEnum>(RoleEnum.USER);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const handleCreate = () => {
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = userRegisterSchema.validate({
      password,
      email,
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

    const avatar = generateAvatar(name);

    createUser({ ...value, role, avatar })
      .then(() => {
        toast.success("User created successful");
        close();
        refresh();
        setName("");
        setPassword("");
        setRole(RoleEnum.USER);
        setEmail("");
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={isShow} onClose={close}>
      <DialogTitle textAlign={"center"}>Create new user</DialogTitle>
      <DialogContent>
        <FormCustom>
          <TextField
            fullWidth
            id="email"
            label="Email address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errorFields.includes("email")}
          />

          <TextField
            fullWidth
            id="name"
            label="User name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errorFields.includes("name")}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-autowidth-label">
              Role
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={role}
              variant={"outlined"}
              onChange={(event) => setRole(event.target.value as RoleEnum)}
              fullWidth
              label="Role"
            >
              {Object.values(RoleEnum).map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            id="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errorFields.includes("password")}
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
          onClick={handleCreate}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UserCreate;
