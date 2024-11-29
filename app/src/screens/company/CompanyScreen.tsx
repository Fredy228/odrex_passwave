import React, { type FC, useEffect, useState } from "react";
import ContainerCustom from "@/components/reused/container/Container";
import { Stack, Typography, useMediaQuery } from "@mui/material";

import Hall from "@/components/ui/hall/Hall";
import useActionStore from "@/global-state/action.store";
import { useParams } from "react-router-dom";
import Search from "@/components/reused/search/Search";
import { CompanyInterface } from "@/interface/company.interface";
import { getCompanyById } from "@/api/company.api";
import { outputError } from "@/services/output-error";
import Box from "@mui/material/Box";

const CompanyScreen: FC = () => {
  const setNavMap = useActionStore((state) => state.setNavMap);
  const { companyId } = useParams();
  const [company, setCompany] = useState<CompanyInterface | null>(null);
  const matches = useMediaQuery("(min-width:768px)");

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

    if (Number(companyId))
      getCompanyById(Number(companyId))
        .then((data) => setCompany(data))
        .catch(outputError);
  }, [companyId, setNavMap]);

  return (
    <main>
      <ContainerCustom>
        <Box>
          <Stack
            direction={matches ? "row" : "column"}
            alignItems="center"
            justifyContent={matches ? "space-between" : "initial"}
          >
            <Typography variant={"h5"}>{company?.name}</Typography>
            <Search
              fields={[
                {
                  name: "Name",
                  value: "name",
                },
              ]}
            />
          </Stack>

          <Hall parentCompany={company} />
        </Box>
      </ContainerCustom>
    </main>
  );
};

export default CompanyScreen;
