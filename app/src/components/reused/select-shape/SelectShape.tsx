import { Dispatch, type FC, SetStateAction, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  listShape: Map<string, string>;
};
const SelectShape: FC<Props> = ({ value, setValue, listShape }) => {
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };

  return (
    <FormControl fullWidth variant={"outlined"}>
      <InputLabel id="custom-shape-select-label">Shape</InputLabel>
      <Select
        labelId="custom-shape-select-label"
        id="custom-shape-select"
        value={value}
        label="Shape"
        onChange={handleChange}
      >
        {Array.from(listShape.keys()).map((item) => {
          const valueByKey = listShape.get(item);
          if (valueByKey && item?.startsWith("image"))
            return (
              <MenuItem key={item} value={item}>
                <img src={valueByKey} alt="Icon" height={50} width={50} />
              </MenuItem>
            );
          if (valueByKey)
            return (
              <MenuItem key={item} value={item}>
                {valueByKey.charAt(0).toUpperCase() + valueByKey.slice(1)}
              </MenuItem>
            );
          return (
            <MenuItem key={item} value={"–"}>
              –
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectShape;
