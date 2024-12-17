import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import AuthProvider from "./components/route/AuthProvider";
import PrivateRoute from "./components/route/PrivateRoute";
import RestrictedRoute from "./components/route/RestrictedRoute";
import { RoleEnum } from "@/enum/role.enum";
import { Stack, Typography } from "@mui/material";

const AuthScreen = lazy(() => import("./screens/auth/AuthScreen"));
const ForgotPassScreen = lazy(
  () => import("./screens/restore-pass/ForgotPassScreen"),
);
const RestorePassScreen = lazy(
  () => import("./screens/restore-pass/RestorePassScreen"),
);
const HomeScreen = lazy(() => import("./screens/home/HomeScreen"));
const UsersScreen = lazy(() => import("./screens/users/UsersScreen"));
const UserByIdScreen = lazy(() => import("./screens/users/UserByIdScreen"));
const GroupsScreen = lazy(() => import("./screens/groups/GroupsScreen"));
const CompanyScreen = lazy(() => import("./screens/company/CompanyScreen"));
const HallsScreen = lazy(() => import("./screens/halls/HallsScreen"));
const TryLoginScreen = lazy(() => import("./screens/try-login/TryLoginScreen"));
const UserDeviceScreen = lazy(
  () => import("./screens/user-device/UserDeviceScreen"),
);

function App() {
  return (
    <Routes>
      <Route
        path={"/"}
        element={
          <AuthProvider>
            <Layout />
          </AuthProvider>
        }
      >
        <Route
          index
          element={
            <PrivateRoute>
              <HomeScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={"/company/:companyId"}
          element={
            <PrivateRoute>
              <CompanyScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={"/company/:companyId/hall/:hallId"}
          element={
            <PrivateRoute>
              <HallsScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={"/users"}
          element={
            <PrivateRoute access={[RoleEnum.ADMIN]}>
              <UsersScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={"/users/:userId"}
          element={
            <PrivateRoute>
              <UserByIdScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={"/sessions"}
          element={
            <PrivateRoute>
              <UserDeviceScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={"/groups"}
          element={
            <PrivateRoute access={[RoleEnum.ADMIN]}>
              <GroupsScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={"/try-login"}
          element={
            <PrivateRoute access={[RoleEnum.ADMIN]}>
              <TryLoginScreen />
            </PrivateRoute>
          }
        />
      </Route>

      <Route
        path={"/auth/login"}
        element={
          <RestrictedRoute>
            <AuthScreen />
          </RestrictedRoute>
        }
      />

      <Route
        path={"/auth/forgot"}
        element={
          <RestrictedRoute>
            <ForgotPassScreen />
          </RestrictedRoute>
        }
      />
      <Route
        path={"/auth/forgot/:key"}
        element={
          <RestrictedRoute>
            <RestorePassScreen />
          </RestrictedRoute>
        }
      />

      <Route
        path={"*"}
        element={
          <>
            <Stack justifyContent="center" alignItems="center" height={"100vh"}>
              <Typography textAlign={"center"} variant={"h4"}>
                Not found page
              </Typography>
            </Stack>
          </>
        }
      />
    </Routes>
  );
}

export default App;
