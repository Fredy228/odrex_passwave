import styled from "@emotion/styled";
import theme from "@/theme";

export const FormContainer = styled.div`
  width: 450px;
  text-align: center;
`;

export const BoxIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${theme.palette.primary.main};
  margin: 10px auto 15px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FormCustom = styled.form`
  display: inline-flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 20px;
  align-items: center;
`;
