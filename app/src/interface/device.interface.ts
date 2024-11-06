export interface DeviceInterface {
  id: number;
  name: string;
  interface: string;
  image: string | null;
  edges_to: number[];
}
