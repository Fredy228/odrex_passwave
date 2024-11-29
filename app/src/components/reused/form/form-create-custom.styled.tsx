import styled from "@emotion/styled";

export const FormCustom = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0;
  width: 320px;

  @media (width < 768px) {
    width: 100%;
  }
`;
