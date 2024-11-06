import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Data,
  Edge,
  Network,
  Node,
  Options,
} from "vis-network/standalone/esm/vis-network";

export interface UseVisNetworkOptions {
  options: Options;
  nodes: Node[];
  edges: Edge[];
}

const useVisNetwork = ({ edges, nodes, options }: UseVisNetworkOptions) => {
  const network = useRef<Network | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<null | number>(null);

  // const data: Data = { nodes, edges };
  const data: Data = useMemo(
    () => ({
      nodes,
      edges,
    }),
    [nodes, edges],
  );

  const removeSelect = useCallback(() => {
    setSelectedNode(null);
    network.current?.unselectAll();
  }, []);

  useEffect(() => {
    if (ref.current) {
      network.current = new Network(ref.current, data, options);
      network.current.on("click", (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          setSelectedNode(nodeId);
        } else {
          setSelectedNode(null);
        }
      });
    }

    return () => {
      console.log("unmount-network");
      network.current?.off("click");
      network.current?.destroy();
    };
  }, [data, options]);

  return {
    network,
    ref,
    selectedNode,
    removeSelect,
  };
};

export default useVisNetwork;
