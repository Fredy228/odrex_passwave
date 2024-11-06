import React, { Dispatch, type FC, SetStateAction } from "react";
import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { AutoSelectOption } from "@/types/autoselect.type";

type Props = {
  options: AutoSelectOption[];
  handleChange: (index: number, newValue: AutoSelectOption | null) => void;
  handleDelete: (index: number) => void;
  mapSelect: AutoSelectOption[];
  setSelect: Dispatch<SetStateAction<AutoSelectOption[]>>;
};
const AutoCompleteWithImg: FC<Props> = ({
  handleChange,
  options,
  handleDelete,
  setSelect,
  mapSelect,
}) => {
  return (
    <>
      {mapSelect.map((item, index) => (
        <Autocomplete
          key={index}
          value={item}
          onChange={(
            _event: any,
            newValue: { id: number | null; label: string | null } | null,
          ) => {
            handleChange(index, newValue);
          }}
          id="controllable-states-demo"
          options={[{ id: null, label: "– No select –" }, ...options]}
          getOptionLabel={(option) => option.label || ""}
          fullWidth
          renderInput={(params) => (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <TextField {...params} label="Relations" />
              <Tooltip title={"Remove relation"}>
                <IconButton
                  type={"button"}
                  aria-label={"remove-complete"}
                  onClick={() => handleDelete(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        />
      ))}
      <Box display={"flex"} justifyContent={"center"}>
        <Tooltip title={"Add relation"}>
          <IconButton
            type={"button"}
            onClick={() =>
              setSelect((prevState) => [
                ...prevState,
                { id: null, label: null },
              ])
            }
          >
            <AddCircleOutlineIcon fontSize={"medium"} />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default AutoCompleteWithImg;
