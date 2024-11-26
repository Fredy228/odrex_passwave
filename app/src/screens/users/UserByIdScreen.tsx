import { type FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import ContainerCustom from "@/components/reused/container/Container";
import { UserInterface } from "@/interface/user.interface";
import useUserStore from "@/global-state/user.store";
import Profile from "@/components/ui/profile/Profile";
import { getUserById } from "@/api/user.api";
import { outputError } from "@/services/output-error";
import LoadingPage from "@/components/reused/loading-page/LoadingPage";

const UserByIdScreen: FC = () => {
  const { userId } = useParams();
  const user = useUserStore((state) => state.user);
  const [fetchUser, setFetchUser] = useState<UserInterface | null>(null);
  const isFetching = useRef<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    if (isFetching.current) return;
    const id = Number(userId);
    if (!id) return;
    setIsLoading(true);
    isFetching.current = true;
    if (id === user?.id) {
      setFetchUser(user);
      setIsLoading(false);
      return;
    }

    getUserById(id)
      .then((data) => setFetchUser(data))
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoading, user, userId]);

  return (
    <main>
      <ContainerCustom>
        <Box margin={"20px 0"}>
          {fetchUser && !isLoading ? (
            <Profile user={fetchUser} />
          ) : isLoading ? (
            <LoadingPage />
          ) : (
            <Typography textAlign={"center"} marginTop={"20px"}>
              Not found profile
            </Typography>
          )}
        </Box>
      </ContainerCustom>
    </main>
  );
};

export default UserByIdScreen;
