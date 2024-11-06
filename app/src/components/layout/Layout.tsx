import { type FC, Suspense } from "react";
import { Outlet } from "react-router-dom";

import LoadingPage from "../reused/loading-page/LoadingPage";
import Header from "@/components/ui/layout/header/Header";
import NavigationMap from "@/components/ui/layout/breadcrumbs/NavigationMap";

const Layout: FC = () => {
  return (
    <>
      <Header />
      <NavigationMap />
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default Layout;
