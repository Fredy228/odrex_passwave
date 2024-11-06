import React, { type FC } from "react";
import { PasswordInterface } from "@/interface/password.interface";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { generateUrlFile } from "@/services/generateUrlFile";

type Props = {
  close: () => void;
  password: PasswordInterface | undefined;
};
const PasswordMore: FC<Props> = ({ close, password }) => {
  return (
    <Dialog open={Boolean(password)} onClose={close}>
      <DialogTitle textAlign={"center"}>{password?.name}</DialogTitle>
      <DialogContent>
        {password?.files?.length && (
          <>
            <Divider>FILES</Divider>
            <Stack direction={"column"} spacing={2} paddingTop={2}>
              {password.files.map((file) => (
                <Stack
                  key={file.file_key}
                  direction={"row"}
                  spacing={2}
                  alignItems={"center"}
                >
                  <Tooltip title={"Download"}>
                    <IconButton
                      href={generateUrlFile(file.file_path) || ""}
                      download={file.file_name}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Paper
                    elevation={2}
                    sx={{
                      width: "50px",
                      height: "50px",
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {file.file_name.split(".").pop()?.toUpperCase() || "?"}
                  </Paper>
                  <Tooltip title={file.file_name}>
                    <Typography
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                      overflow={"hidden"}
                    >
                      {file.file_name}
                    </Typography>
                  </Tooltip>
                </Stack>
              ))}
              {password.notes && (
                <>
                  <Divider>NOTES</Divider>
                  <Typography>{password.notes}</Typography>
                </>
              )}
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button type={"button"} onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordMore;
