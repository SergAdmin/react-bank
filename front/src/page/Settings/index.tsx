// Сторінка налаштувань, на якій можна: Змінити пароль Змінити
// пошту Вийти з акаунту Кожна дія повинна в кінці оновлювати
// контекст аутентифікації

import BackBtn from "../../container/BackArrow";
import Input from "../../container/Input";
import { useState, useMemo, useEffect } from "react";
import { ErrorObject } from "../../utilits/ErrorObject";
import Button from "../../container/Button";

import { useAuth } from "../../utilits/AuthContext";
import { useNavigate } from "react-router-dom";
import { REG_EXP } from "../../utilits/RegExp";

import StatusBar from "../../container/StatusBar";
import Title from "../../container/Title";

import "../../App.css";

const Settings = () => {
  const [email, setEmail] = useState<string>("");
  const [emailPassword, setEmailPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isDisabledEmail, setIsDisabledEmail] = useState<boolean>(false);
  const [isDisabledPasswordd, setIsDisabledPassword] = useState<boolean>(false);

  const [emailErr, setEmailErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [emailPasswordErr, setEmailPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [oldPasswordErr, setOldPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [newPasswordErr, setNewPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(email);
  }, [email]);

  const checkEmailPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(emailPassword);
  }, [emailPassword]);

  const checkNewPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(newPassword);
  }, [newPassword]);

  const checkOldPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(oldPassword);
  }, [oldPassword]);

  useEffect(() => {
    if (checkEmailPasswordValidity || checkEmailValidity) {
      setIsDisabledEmail(false);
    }
    if (checkNewPasswordValidity || checkOldPasswordValidity) {
      setIsDisabledPassword(false);
    }
  }, [
    checkEmailPasswordValidity,
    checkEmailValidity,
    checkNewPasswordValidity,
    checkOldPasswordValidity,
  ]);

  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleSubmitEmail = async () => {
    setEmailErr({
      result: checkEmailValidity,
      message: checkEmailValidity ? "" : "Введіть правильний email",
    });

    if (emailPassword.length < 8) {
      setEmailPasswordErr({
        result: false,
        message: "Ваш пароль занадто короткий",
      });
    } else {
      setEmailPasswordErr({
        result: checkEmailPasswordValidity,
        message: checkEmailPasswordValidity ? "" : "Ваш пароль занадто простий",
      });
    }
    try {
      if (emailPasswordErr.result && emailErr.result) {
        if (emailPassword === state.user.password) {
          const res = await fetch("http://localhost:4000/settings-email", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              token: state.token,
              email: email,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            dispatch({ type: "LOGIN", email: data.email });
            setEmailErr({
              result: true,
              message: "",
            });

            setEmailPasswordErr({
              result: true,
              message: "",
            });

            setEmail("");

            setEmailPassword("");

            setIsDisabledEmail(false);
          } else {
            setIsDisabledEmail(true);
          }
        } else {
          setEmailPasswordErr({
            result: false,
            message: "Введіть правильний пароль",
          });
          setIsDisabledEmail(true);
        }
      } else {
        setIsDisabledEmail(true);
      }
    } catch (err) {
      setIsDisabledEmail(true);
    }
  };

  const handleSubmitPassword = async () => {
    if (newPassword.length < 8) {
      setNewPasswordErr({
        result: false,
        message: "Ваш пароль занадто короткий",
      });
    } else {
      setNewPasswordErr({
        result: checkNewPasswordValidity,
        message: checkNewPasswordValidity ? "" : "Ваш пароль занадто простий",
      });
    }
    try {
      if (newPasswordErr.result && oldPasswordErr.result) {
        if (oldPassword === state.user.password) {
          const res = await fetch("http://localhost:4000/settings-password", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              token: state.token,
              password: newPassword,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            dispatch({ type: "LOGIN", password: data.password });
            setOldPasswordErr({
              result: true,
              message: "",
            });

            setNewPasswordErr({
              result: true,
              message: "",
            });

            setNewPassword("");

            setOldPassword("");

            setIsDisabledPassword(false);
          } else {
            setNewPasswordErr({
              result: false,
              message: data.message,
            });
            setIsDisabledPassword(true);
          }
        } else {
          setOldPasswordErr({
            result: false,
            message: "Введіть правильний код",
          });
          setIsDisabledEmail(true);
        }
      } else {
        setIsDisabledPassword(true);
      }
    } catch (err) {
      setIsDisabledPassword(true);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    if (!state.user.email) {
      navigate("/");
    }
  };
  return (
    <div className="page">
      <StatusBar type="black" />
      <header className="gridded__header">
        <BackBtn />
        <Title title="Settings" />
      </header>

      <main className="main">
        <div className="container">
          <h2 className="settings-heading__title">Change email</h2>

          <Input
            type="email"
            name="Email"
            value={email}
            setValue={setEmail}
            error={emailErr}
          />

          <Input
            type="password"
            name="Password"
            isPassword
            value={emailPassword}
            setValue={setEmailPassword}
            error={emailPasswordErr}
          />

          <Button
            modification="outline"
            text="Save email"
            type="submit"
            disabled={isDisabledEmail}
            action={() => handleSubmitEmail()}
          />

          <div className="splitter" />
        </div>

        <div className="container">
          <h2 className="settings-heading__title">Change password</h2>

          <Input
            type="password"
            name="Password"
            isPassword
            value={oldPassword}
            setValue={setOldPassword}
            error={oldPasswordErr}
          />

          <Input
            type="password"
            name="New password"
            isPassword
            value={newPassword}
            setValue={setNewPassword}
            error={newPasswordErr}
          />

          <Button
            text="Save submit"
            type="submit"
            modification="outline"
            disabled={isDisabledPasswordd}
            action={() => handleSubmitPassword()}
          />

          <div className="splitter" />
        </div>

        <Button
          modification="outline-red"
          text="Log out"
          type="submit"
          action={() => handleLogout()}
        />
      </main>
    </div>
  );
};

export default Settings;
