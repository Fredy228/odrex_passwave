import React, { type FC, useEffect } from "react";

import ContainerCustom from "@/components/reused/container/Container";
import Company from "@/components/ui/company/Company";
import { Inner } from "@/screens/home/home.styled";
import useActionStore from "@/global-state/action.store";
import Search from "@/components/reused/search/Search";

const HomeScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);

  useEffect(() => {
    setNavMap([
      {
        path: "/",
        name: "Companies",
      },
    ]);
  }, [setNavMap]);

  return (
    <main>
      <ContainerCustom>
        <Inner>
          <Search
            fields={[
              {
                name: "Name",
                value: "name",
              },
            ]}
          />
          <Company />
        </Inner>
      </ContainerCustom>
    </main>
  );
};

export default HomeScreen;
