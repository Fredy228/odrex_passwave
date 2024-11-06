import { type FC, useEffect, useState } from "react";
import {
  InputAdornment,
  Box,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  IconButton,
  Input,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useDebounce } from "use-debounce";

import usePagination from "@/hooks/use-pagination";
import { getFirstFieldValue } from "@/services/get-first-value-filter";

type Props = {
  fields: Array<{
    value: string;
    name: string;
  }>;
};
const Search: FC<Props> = ({ fields }) => {
  const { filter, setQuery } = usePagination();

  const keyFilterUrl = getFirstFieldValue(filter);
  const [value, setValue] = useState<string>(
    keyFilterUrl && filter ? filter[keyFilterUrl] : "",
  );
  const [filterField, setFilterField] = useState<string>(
    fields.find((i) => i.value === keyFilterUrl)?.value || fields[0].value,
  );
  const [debouncedQuery] = useDebounce(value, 1000);

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setValue("");
    setFilterField(event.target.value);
  };

  useEffect(() => {
    setQuery([
      {
        value:
          debouncedQuery.trim() === ""
            ? null
            : JSON.stringify({
                [filterField]: debouncedQuery.trim(),
              }),
        field: "filter",
      },
    ]);
  }, [debouncedQuery, filterField, setQuery]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: "10px",
        justifyContent: "flex-start",
      }}
    >
      <FormControl sx={{ minWidth: 80 }} variant={"standard"}>
        <InputLabel id={"field-select-label"}>Field</InputLabel>
        <Select
          labelId="field-select-label"
          id="field-select"
          value={filterField}
          onChange={handleChangeSelect}
          autoWidth
          label="Field"
        >
          {fields.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant={"standard"}>
        <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
        <Input
          id="input-with-icon-textfield"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          startAdornment={
            <InputAdornment position={"start"}>
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position={"end"}>
              <IconButton type={"button"} onClick={() => setValue("")}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
};

export default Search;
