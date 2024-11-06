import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

import { ReactComponent as Logo } from "@/assets/galaxion_logo.svg";
import theme from "@/theme";

export const LogoCustom = styled(Logo)`
  width: 50px;
  height: 50px;
`;

export const ListMenu = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-left: 20px;
`;

export const ItemLink = styled(NavLink)`
  padding: 5px 7px;
  text-decoration: none;
  color: inherit;
  transition: ${theme.transitions.create(["color"], {
    duration: theme.transitions.duration.standard,
  })};

  &:hover {
    color: ${theme.palette.primary.light};
  }

  &.active {
    color: ${theme.palette.primary.light};
  }
`;
