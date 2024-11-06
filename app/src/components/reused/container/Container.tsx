import { type FC, PropsWithChildren } from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  margin: 0 auto;
  width: 100%;

  @media screen and (max-width: 767px) {
    padding: 0 10px;
    max-width: 320px;
  }

  @media screen and (min-width: 768px) {
    padding: 0 15px;
    max-width: 768px;
  }

  @media screen and (min-width: 1025px) {
    padding: 0 20px;
    max-width: 1440px;
  }
`;

const ContainerCustom: FC<PropsWithChildren> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default ContainerCustom;
