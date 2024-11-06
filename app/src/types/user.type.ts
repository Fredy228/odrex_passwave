import { CountryCode } from "libphonenumber-js";

export type UserPhoneType = {
  country: CountryCode;
  number: string;
};
