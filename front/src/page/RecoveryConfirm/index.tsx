//Сторінка підтвердження відновлення та оновлення пароля. Після
//відправки форми потрібно перевести на сторінку /balance

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../container/BackArrow";
import Button from "../../container/Button";
import Input from "../../container/Input";
import { ErrorObject } from "../../utilits/ErrorObject";
import { REG_EXP } from "../../utilits/RegExp";

import { useAuth } from "../../utilits/AuthContext";

import StatusBar from "../../container/StatusBar";
import Title from "../../container/Title";

import "../../App.css";

const RecoveryConfirm = () => {
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [codeErr, setCodeErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const [passwordErr, setPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const { state, dispatch } = useAuth();

  const checkPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(password);
  }, [password]);

  const checkCodeValidity = useMemo(() => {
    if (code.length < 6) {
      return false;
    }
    return true;
  }, [code]);

  useEffect(() => {
    if (checkPasswordValidity || checkCodeValidity) {
      setIsDisabled(false);
    }
  }, [checkPasswordValidity, checkCodeValidity]);

  const navigation = useNavigate();

  const handleSubmit = async () => {
    if (password.length < 8) {
      setPasswordErr({ result: false, message: "Ваш пароль занадто короткий" });
    } else {
      setPasswordErr({
        result: checkPasswordValidity,
        message: checkPasswordValidity ? "" : "Ваш пароль занадто простий",
      });
    }

    setCodeErr({
      result: checkCodeValidity,
      message: checkCodeValidity ? "" : "Введіть код підтвердження",
    });

    try {
      if (checkCodeValidity && checkPasswordValidity) {
        const res = await fetch("http://localhost:4000/recovery-confirm", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            newPassword: password,
            email: state.user.email,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setPasswordErr({
            result: true,
            message: "",
          });
          setAlert("");

          setCodeErr({
            result: true,
            message: "",
          });

          dispatch({ type: "LOGIN", ...data.user });

          console.log(state);

          navigation("/balance");
        } else {
          setAlert(data.message);
        }
      } else {
        setAlert("Fill in all the fields");
        setIsDisabled(true);
      }
    } catch (err: any) {
      if (err.message) {
        setAlert(err.message);
        setIsDisabled(true);
      }
    }
  };

  return (
    <div className="page">
      <StatusBar type="black" />
      <header className="header">
        <BackBtn />
      </header>

      <main className="main">
        <div className="heading">
          <Title
            title="Recover password"
            description="Choose a recovery method"
          />
        </div>

        <Input
          type="code"
          name="Code"
          value={code}
          setValue={setCode}
          error={codeErr}
        />

        <Input
          type="password"
          name="Password"
          isPassword
          value={password}
          setValue={setPassword}
          error={passwordErr}
        />

        <Button
          text="Send code"
          type="submit"
          disabled={isDisabled}
          action={() => handleSubmit()}
        />

        {!!alert && (
          <div className="alert">
            <div className="alert__icon" />
            {alert}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecoveryConfirm;
