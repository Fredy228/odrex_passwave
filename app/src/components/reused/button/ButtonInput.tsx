import { ChangeEvent, Dispatch, type FC, SetStateAction } from "react";
import {
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { IFilesPass } from "@/interface/password.interface";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type Props = {
  files: Array<File>;
  setFile: Dispatch<SetStateAction<Array<File>>>;
  filesUploaded?: Array<IFilesPass>;
  deleteUploaded?: (key: string) => void;
};
const ButtonInput: FC<Props> = ({
  files,
  setFile,
  filesUploaded,
  deleteUploaded,
}) => {
  const handleDelete = (index: number) => {
    setFile((prevState) => prevState.filter((_i, idx) => idx !== index));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const listFile: FileList | null = event.target.files;
    if (!listFile) return;
    const modifyList = Array.from(
      { length: listFile.length },
      (_, idx) => listFile[idx],
    );
    setFile((prevState) => [...prevState, ...modifyList]);
  };

  return (
    <Stack direction={"column"} spacing={2}>
      <Stack>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput type="file" onChange={handleChange} multiple />
        </Button>
      </Stack>
      <Stack direction={"column"} spacing={0.5}>
        {filesUploaded && (
          <>
            <Divider>Uploaded</Divider>
            {filesUploaded.map((i) => (
              <Stack
                key={i.file_key}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Tooltip title={i.file_name}>
                  <Typography
                    whiteSpace={"nowrap"}
                    textOverflow={"ellipsis"}
                    overflow={"hidden"}
                  >
                    {i.file_name}
                  </Typography>
                </Tooltip>
                <IconButton
                  type={"button"}
                  onClick={() => deleteUploaded && deleteUploaded(i.file_key)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
          </>
        )}
        {files?.length > 0 && (
          <>
            <Divider>Adding</Divider>
            {Array.from({ length: files?.length }, (_, i) => (
              <Stack
                key={i}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Tooltip title={files[i].name}>
                  <Typography
                    whiteSpace={"nowrap"}
                    textOverflow={"ellipsis"}
                    overflow={"hidden"}
                  >
                    {files[i].name}
                  </Typography>
                </Tooltip>
                <IconButton type={"button"} onClick={() => handleDelete(i)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default ButtonInput;
