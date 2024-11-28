import styled from "@emotion/styled";
import { IconButton } from "@mui/material";

import theme from "@/theme";

export const ButtonCreate = styled(IconButton)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 200;

  width: 70px;
  height: 70px;

  background-color: ${theme.palette.secondary.light};
  color: #fff;
  transition: ${theme.transitions.create(["background-color"], {
    duration: theme.transitions.duration.standard,
  })};

  > svg {
    width: 35px;
    height: 35px;
  }

  &:hover {
    background-color: ${theme.palette.primary.main};
  }
`;

export const ButtonCircleRight = styled(ButtonCreate)`
  left: initial;
  right: 20px;
`;
