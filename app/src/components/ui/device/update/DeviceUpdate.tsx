import React, { type FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { outputError } from "@/services/output-error";
import { FormCustom } from "@/components/reused/form/form-create-custom.styled";
import { DeviceUpdateSchema } from "@/validate/device.schema";
import { getDeviceById, updateDevice } from "@/api/device.api";
import { DeviceInterface } from "@/interface/device.interface";
import SelectShape from "@/components/reused/select-shape/SelectShape";
import deviceListIcons from "@/components/ui/device/list-icons";
import AutoCompleteWithImg from "@/components/reused/autocomplete-with-img/AutoCompleteWithImg";
import { AutoSelectOption } from "@/types/autoselect.type";

type Props = {
  close: () => void;
  refresh: () => void;
  id: number | null;
  list: DeviceInterface[];
};
const DeviceUpdate: FC<Props> = ({ close, refresh, id, list }) => {
  const options = list.map((i) => ({ id: i.id, label: i.name }));
  const [name, setName] = useState<string>("");
  const [interfaceName, setInterfaceName] = useState<string>("");
  const [image, setImage] = useState<string>(deviceListIcons.get("box"));
  const [edgesTo, setEdgesTo] = useState<Array<AutoSelectOption>>([
    {
      id: null,
      label: null,
    },
  ]);
  const isMoreMobile = useMediaQuery("(min-width:768px)");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const [originalDevice, setOriginalDevice] = useState<DeviceInterface | null>(
    null,
  );

  const handleChangeEdges = (
    index: number,
    value: { id: number | null; label: string | null } | null,
  ) => {
    if (!value) return;

    setEdgesTo((prevState) => {
      prevState[index].id = value.id;
      prevState[index].label = value.label;

      return prevState;
    });
  };

  const handleDeleteEdges = (index: number) => {
    setEdgesTo((prevState) => {
      if (prevState.length > 1) {
        return prevState.filter((_i, idx) => idx !== index);
      }
      return prevState;
    });
  };

  const handleUpdate = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!id || !originalDevice) return;
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = DeviceUpdateSchema.validate({
      name,
      interfaceName: interfaceName.trim() || undefined,
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

    const edgesFilter = edgesTo
      .map((i) => i.id)
      .filter((i) => Boolean(i)) as number[];

    updateDevice(
      {
        name: value.name === originalDevice?.name ? undefined : value.name,
        interface:
          value.interfaceName === originalDevice?.interface
            ? undefined
            : value.interfaceName,
        image: image === originalDevice.image ? undefined : image,
        edges_to: edgesFilter,
      },
      id,
    )
      .then(() => {
        toast.success("Device updated successful");
        setName("");
        setInterfaceName("");
        setImage(deviceListIcons.get("box"));
        setEdgesTo([
          {
            id: null,
            label: null,
          },
        ]);
        close();
        refresh();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!id) return;

    getDeviceById(id)
      .then((data) => {
        setName(data.name);
        setInterfaceName(data.interface || "");
        setImage(
          data.image && deviceListIcons.get(data.image) ? data.image : "box",
        );
        setEdgesTo(
          data.edges_to.map((item) => ({
            id: item,
            label: list.find((i) => i.id === item)?.name || null,
          })),
        );
        setOriginalDevice(data);
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  }, [id, list]);

  return (
    <Dialog open={Boolean(id)} onClose={close} fullWidth={!isMoreMobile}>
      <DialogTitle textAlign={"center"}>Update new device</DialogTitle>
      <DialogContent>
        <FormCustom onSubmit={handleUpdate}>
          <TextField
            fullWidth
            id="name"
            label="Device name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errorFields.includes("name")}
          />
          <TextField
            fullWidth
            id="interface"
            label="Device interface"
            variant="outlined"
            value={interfaceName}
            onChange={(e) => setInterfaceName(e.target.value)}
            error={errorFields.includes("interface")}
          />
          <SelectShape
            setValue={setImage}
            value={image}
            listShape={deviceListIcons}
          />
          <AutoCompleteWithImg
            handleChange={handleChangeEdges}
            handleDelete={handleDeleteEdges}
            options={options}
            setSelect={setEdgesTo}
            mapSelect={edgesTo}
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
          onClick={() => handleUpdate()}
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceUpdate;
