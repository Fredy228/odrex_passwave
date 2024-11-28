import React, {
  type FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Options, Edge, Node } from "vis-network/standalone/esm/vis-network";
import { Paper } from "@mui/material";

import { DeviceInterface } from "@/interface/device.interface";
import useVisNetwork from "@/components/ui/device/schema/useVisNetwork";
import deviceListIcons from "@/components/ui/device/list-icons";
import DeviceOpen from "@/components/ui/device/open/DeviceOpen";
import DeviceDelete from "@/components/ui/device/delete/DeviceDelete";
import DeviceUpdate from "@/components/ui/device/update/DeviceUpdate";

const options: Options = {
  nodes: {
    shape: "box",
  },
  edges: {
    // arrows: {
    // to: true,
    // from: true,
    // },
  },
};

type Props = {
  devices: DeviceInterface[];
  refresh: () => void;
};
const DeviceSchema: FC<Props> = ({ devices, refresh }) => {
  const [deviceDelete, setDeviceDelete] = useState<number | null>(null);
  const [deviceUpdate, setDeviceUpdate] = useState<number | null>(null);

  const edges: Edge[] = useMemo(
    () =>
      devices
        .map((item) =>
          item.edges_to.map((edg) => ({
            to: item.id,
            from: edg,
          })),
        )
        .flat(),
    [devices],
  );

  const nodes: Node[] = useMemo(
    () =>
      devices.map((item) => {
        const data: Node = {
          id: item.id,
          label: item.name,
          title: item.interface,
          size: 30,
          shape: deviceListIcons.get("box"),
        };
        if (item?.image?.startsWith("image")) {
          data["shape"] = "image";
          data["image"] = deviceListIcons.get(item.image);
        } else if (item?.image) {
          data["shape"] = item.image;
        }

        return data;
      }),
    [devices],
  );

  const { ref, selectedNode, removeSelect } = useVisNetwork({
    options,
    edges,
    nodes,
  });

  // const handleClick = () => {
  //   if (!network) return;
  //
  //   network.current?.focus(5);
  // };

  const appBar = document.getElementById("app-bar");
  const breadcrumb = document.getElementById("bread-crumb");
  let heightSchema = 40;
  if (appBar) heightSchema += appBar.offsetHeight;
  if (breadcrumb) heightSchema += breadcrumb.offsetHeight;

  return (
    <>
      <DeviceUpdate
        id={deviceUpdate}
        close={() => setDeviceUpdate(null)}
        list={devices}
        refresh={refresh}
      />
      <DeviceDelete
        close={() => setDeviceDelete(null)}
        refresh={refresh}
        id={deviceDelete}
      />
      <DeviceOpen
        device={devices.find((item) => item.id === selectedNode) || null}
        close={() => removeSelect()}
        openDelete={() => setDeviceDelete(selectedNode)}
        openEdit={() => setDeviceUpdate(selectedNode)}
      />
      <Paper
        elevation={3}
        sx={{
          height: heightSchema ? `calc(100vh - ${heightSchema}px)` : "100vh",
          width: "100%",
          position: "relative",
        }}
        ref={ref}
      />
    </>
  );
};

export default DeviceSchema;
