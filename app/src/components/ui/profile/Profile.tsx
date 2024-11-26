import { ChangeEvent, type FC, useState } from "react";
import {
  Avatar,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

import { UserInterface } from "@/interface/user.interface";
import { generateUrlFile } from "@/services/generateUrlFile";
import { RoleEnum } from "@/enum/role.enum";
import useUserStore from "@/global-state/user.store";
import { userUpdateSchema } from "@/validate/user.schema";
import getChangedFields from "@/services/getChangedFieldsSimple";
import { updateUserById } from "@/api/user.api";
import { outputError } from "@/services/output-error";
import { changeUserPassword } from "@/api/auth";

type Props = {
  user: UserInterface;
};
const Profile: FC<Props> = ({ user }) => {
  const userCurrent = useUserStore((state) => state.user);

  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [role, setRole] = useState<RoleEnum>(user.role);
  const [currentPass, setCurrentPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [reNewPass, setReNewPass] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);
  const [editMode, setEditMode] = useState(false);

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditMode(event.target.checked);
  };

  const handleUpdateUser = async () => {
    const stateFields = {
      name,
      email,
      role,
    };

    const changedFields = getChangedFields(user, stateFields as UserInterface);
    if (!changedFields) {
      setIsLoading(false);
      return;
    }

    const { error, value } = userUpdateSchema.validate(changedFields || {});

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    updateUserById(user.id, value)
      .then(() => toast.success("User updated successful"))
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  const handleRestorePass = async () => {
    setIsLoading(true);

    changeUserPassword(currentPass, newPass)
      .then(() => {
        toast.success("Successful updated");
        setCurrentPass("");
        setNewPass("");
        setReNewPass("");
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <FormControlLabel
        control={<Switch checked={editMode} onChange={handleEditChange} />}
        label="Edit mode"
      />
      <Divider sx={{ fontWeight: 600 }}>Personal info</Divider>
      <Stack
        direction={"column"}
        spacing={3}
        margin={"15px 0"}
        maxWidth={"500px"}
      >
        <Stack direction={"column"} spacing={2}>
          <Typography>Avatar:</Typography>
          <Avatar src={generateUrlFile(user.avatarUrl)} alt={user.name} />
        </Stack>
        <Stack direction={"column"} spacing={2}>
          <Typography>Name:</Typography>
          <TextField
            fullWidth
            id="name"
            label="User name"
            variant="outlined"
            value={name}
            disabled={!editMode}
            onChange={(e) => setName(e.target.value)}
            error={errorFields.includes("name")}
          />
        </Stack>
        <Stack direction={"column"} spacing={2}>
          <Typography>Email:</Typography>
          <TextField
            fullWidth
            id="email"
            label="Email address"
            variant="outlined"
            value={email}
            disabled={!editMode}
            onChange={(e) => setEmail(e.target.value)}
            error={errorFields.includes("email")}
          />
        </Stack>
        <Stack direction={"column"} spacing={2}>
          <Typography>Role:</Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-autowidth-label">
              Role
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={role}
              variant={"outlined"}
              disabled={userCurrent?.role !== RoleEnum.ADMIN || !editMode}
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
        </Stack>
      </Stack>
      <LoadingButton
        variant="contained"
        disabled={!editMode}
        loading={isLoading}
        type={"button"}
        onClick={handleUpdateUser}
      >
        Save profile
      </LoadingButton>
      {userCurrent?.id === user.id && (
        <>
          <Divider sx={{ fontWeight: 600, marginTop: "30px" }}>
            Password
          </Divider>
          <Stack
            direction={"column"}
            spacing={3}
            margin={"15px 0"}
            maxWidth={"500px"}
          >
            <Stack direction={"column"} spacing={2}>
              <Typography>Current password:</Typography>
              <TextField
                fullWidth
                id="currentPass"
                label="Current password"
                variant="outlined"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                error={errorFields.includes("currentPass")}
              />
            </Stack>
            <Stack direction={"column"} spacing={2}>
              <Typography>New password:</Typography>
              <TextField
                fullWidth
                id="newPass"
                label="New password"
                variant="outlined"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                error={errorFields.includes("newPass")}
              />
            </Stack>
            <Stack direction={"column"} spacing={2}>
              <Typography>Repeat password:</Typography>
              <TextField
                fullWidth
                id="reNewPass"
                label="Repeat password"
                variant="outlined"
                value={reNewPass}
                onChange={(e) => setReNewPass(e.target.value)}
                error={errorFields.includes("reNewPass")}
              />
            </Stack>
          </Stack>
          <LoadingButton
            variant="contained"
            disabled={newPass !== reNewPass}
            loading={isLoading}
            type={"button"}
            onClick={handleRestorePass}
          >
            Change password
          </LoadingButton>
        </>
      )}
    </>
  );
};

export default Profile;
