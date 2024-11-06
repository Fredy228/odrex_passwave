import React, { type FC, useEffect } from "react";
import ContainerCustom from "@/components/reused/container/Container";
import { Typography } from "@mui/material";

import Hall from "@/components/ui/hall/Hall";
import useActionStore from "@/global-state/action.store";
import { useParams } from "react-router-dom";
import Search from "@/components/reused/search/Search";

const CompanyScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);
  const { companyId } = useParams();

  useEffect(() => {
    setNavMap([
      {
        path: "/",
        name: "Companies",
      },
      {
        path: `company${companyId}/`,
        name: "Halls",
      },
    ]);
  }, [companyId, setNavMap]);

  return (
    <main>
      <ContainerCustom>
        <div>
          {/*<Typography variant={"h4"} textAlign={"center"} mt={2}>*/}
          {/*  Halls*/}
          {/*</Typography>*/}
          <Search
            fields={[
              {
                name: "Name",
                value: "name",
              },
            ]}
          />
          <Hall />
        </div>
      </ContainerCustom>
    </main>
  );
};

export default CompanyScreen;
