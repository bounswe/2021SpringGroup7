import React from 'react';
import {
  useCallback,
  useMemo,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import queryClient from '../../configs/reactQuery';
import {AUTH_KEY} from '../../constants/storageKeys';
import {SERVICE} from '../../services/services';
import {useMutation} from 'react-query';

const AuthContext = createContext({
  user: {isAuthenticated: false},
  login: data => data,
  updateUserInfo: data => data,
  logout: () => undefined,
});

function AuthProvider({children}) {
  const [user, setUser] = useState({
    userInfo: {},
    isAuthenticated: false,
  });

  //TODO: Fix read data from AsyncStorage
  useEffect(() => {
    async function fetchAsyncStorage() {
      const asycnStorage = await AsyncStorage.getItem(AUTH_KEY);
      if (asycnStorage) {
        const tempData = await AsyncStorage.getItem(AUTH_KEY);
        loginValues = JSON.parse(tempData);
        setUser({
          userInfo: loginValues,
          isAuthenticated: true,
        });
        await fetchUserInfo.mutateAsync({
          params: {userId: loginValues.user_id, token: loginValues.token},
        });
      }
    }
    fetchAsyncStorage();
  }, [setUser]);

  const updateUserInfo = async data => {
    await setUser(prevState => ({
      userInfo: {
        ...prevState.userInfo,
        ...data,
      },
      isAuthenticated: prevState.isAuthenticated,
    }));
  };

  const fetchUserInfo = useMutation(params => SERVICE.fetchUserInfo(params), {
    onSuccess(response) {
      handleSetUserInfo(response.data.response);
    },
    onError({response}) {
      console.log('res error: ', response);
    },
  });

  const handleSetUserInfo = async data => {
    await setUser(prevState => ({
      userInfo: {
        ...prevState.userInfo,
        ...data,
      },
      isAuthenticated: prevState.isAuthenticated,
    }));
  };

  const login = async data => {
    await setUser({
      userInfo: {token: data.token, user_id: data.user_id},
      isAuthenticated: true,
    });
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(data));
    await fetchUserInfo.mutateAsync({
      params: {userId: data.user_id, token: data.token},
    });
  };

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    queryClient.clear();
    setUser({isAuthenticated: false});
  }, [setUser]);

  const value = useMemo(
    () => ({user, login, logout, updateUserInfo}),
    [user, login, logout, updateUserInfo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export {AuthProvider, useAuth};
