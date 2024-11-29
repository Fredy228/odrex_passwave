import styled from "@emotion/styled";
import { Paper } from "@mui/material";
import theme from "@/theme";

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;

  @media (width < 1025px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (width < 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const Item = styled(Paper)`
  position: relative;
`;
export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 50px 25px;

  cursor: pointer;
  transition: ${theme.transitions.create(["color"], {
    duration: theme.transitions.duration.standard,
  })};

  > svg {
    width: 35px;
    height: 35px;
    color: inherit;
  }

  &:hover {
    color: ${theme.palette.primary.main};
  }
`;
