export interface IFilesPass {
  file_key: string;
  file_name: string;
  file_path: string;
}

export interface PasswordInterface {
  id: number;
  name: string;
  entry?: string;
  address?: string;
  access?: string;
  login?: string;
  password?: string;
  notes?: string;
  files?: Array<IFilesPass>;
}
