import React from "react";
import firebase, {auth} from "../services/firebase";
import {UserDBService} from "../services/to_remove/UserDBService";
import {LogService} from "../services/LogService";
import {useNavigate} from "react-router-dom";

const AuthContext = React.createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    auth.onAuthStateChanged(async (userData) => {
      try {
        if (user) {
          const user = await UserDBService.getUserByFirebaseId(userData.uid);
          setUser(user);
        } else {
          setUser(null);
          navigate("/");
        }
      } catch (e) {
        LogService.showAndLogError("get user data error", e);
      }
    });
    return () => {
      auth.onAuthStateChanged(() => {
      });
    };
  }, []);

  let signin = (newUser, callback) => {
    // setUser(newUser);
    // callback();
  };

  let signout = (callback) => {
    setUser(null)
  };

  let value = {user, signin, signout, setUser};

  return <AuthContext.Provider
    value={value}
    children={children}
  />;
}

export const useAuth = () => {
  const contextValue = React.useContext(AuthContext);
  if (contextValue === undefined) {
    throw new Error("Tried to use context from outside the provider");
  }
  return contextValue;
};