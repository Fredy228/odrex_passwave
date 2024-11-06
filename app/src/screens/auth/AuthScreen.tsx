import { type FC } from "react";

import ContainerCustom from "../../components/reused/container/Container";
import { Inner } from "./auth.styled";
import AuthForm from "../../components/ui/auth/auth-form/AuthForm";

const AuthScreen: FC = () => {
  return (
    <main>
      <ContainerCustom>
        <Inner>
          <AuthForm />
        </Inner>
      </ContainerCustom>
    </main>
  );
};

export default AuthScreen;
