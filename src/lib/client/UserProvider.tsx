import { createContext, useContext } from 'react';
import { trpc } from './trpc';
import { UserToken } from 'src/types/userToken';

type User = {
  user: UserToken | undefined;
  isLoading: boolean;
};

const UserContext = createContext({} as User);

export const useUser = () => {
  return useContext(UserContext);
};

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = trpc.users.user.useQuery(undefined, {
    retry: false,
  });

  return (
    <UserContext.Provider
      value={{
        user: user.data as UserToken,
        isLoading: user.isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
