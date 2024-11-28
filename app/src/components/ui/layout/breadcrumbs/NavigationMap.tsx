import { type FC } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import useActionStore from "@/global-state/action.store";
import ContainerCustom from "@/components/reused/container/Container";

const NavigationMap: FC = () => {
  const navMap = useActionStore((state) => state.navMap);

  const length = navMap.length;

  if (!length) return null;

  return (
    <ContainerCustom>
      <Breadcrumbs
        id={"bread-crumb"}
        aria-label="breadcrumb"
        sx={{ padding: "10px 0" }}
      >
        {navMap.map((item, index) => {
          if (index + 1 === length)
            return (
              <Typography key={item.path} sx={{ color: "text.primary" }}>
                {item.name}
              </Typography>
            );

          let fullPath = "";

          for (let i = 0; i <= index; i++) {
            fullPath = fullPath + String(navMap[i].path);
          }

          return (
            <Link
              key={fullPath}
              underline="hover"
              color="inherit"
              href={fullPath}
            >
              {item.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </ContainerCustom>
  );
};

export default NavigationMap;
