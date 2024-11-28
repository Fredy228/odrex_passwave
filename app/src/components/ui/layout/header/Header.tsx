import { type FC, useState } from "react";
import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { remove } from "local-storage";

import ContainerCustom from "@/components/reused/container/Container";
import {
  ItemLink,
  ListMenu,
  LogoCustom,
} from "@/components/ui/layout/header/header.styled";
import useUserStore from "@/global-state/user.store";
import { RoleEnum } from "@/enum/role.enum";
import { logoutUser } from "@/api/auth";
import { outputError } from "@/services/output-error";
import { generateUrlFile } from "@/services/generateUrlFile";

const Header: FC = () => {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    logoutUser()
      .then(() => {
        toast.success("Logout successfully");
        remove("token");
        clearUser();
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <AppBar id={"app-bar"} position="static" color={"secondary"}>
      <ContainerCustom>
        <Toolbar disableGutters>
          <LogoCustom />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              ml: 2,
              textDecoration: "none",
              color: "#fff",
              fontWeight: "700",
            }}
          >
            PassWave
          </Typography>

          <ListMenu>
            {user?.role === RoleEnum.ADMIN && (
              <>
                <ItemLink to={"/users"}>Users</ItemLink>
                <ItemLink to={"/groups"}>Groups</ItemLink>
              </>
            )}
          </ListMenu>

          <Box
            display={"flex"}
            alignItems={"center"}
            gap={"10px"}
            marginLeft={"auto"}
          >
            <Typography>{user?.name}</Typography>
            <IconButton onClick={handleOpenUserMenu}>
              <Avatar
                src={generateUrlFile(user?.avatarUrl)}
                alt={"User avatar"}
              />
            </IconButton>
            <Menu
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              <MenuItem onClick={() => navigate(`/users/${user?.id}`)}>
                <Typography>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </ContainerCustom>
    </AppBar>
  );
};

export default Header;
