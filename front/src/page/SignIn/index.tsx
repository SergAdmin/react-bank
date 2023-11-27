//Вхід в акаунт. Зберігаємо дані аутентифікації в контекст. Якщо
//user.confirm є false, то перенаправляємо на /signup-confirm

import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import BackButton from "../../container/BackArrow";
import Button from "../../container/Button";
import Input from "../../container/Input";

import { useAuth } from "../../utilits/AuthContext";
import { REG_EXP } from "../../utilits/RegExp";
import { ErrorObject } from "../../utilits/ErrorObject";

import StatusBar from "../../container/StatusBar";
import Title from "../../container/Title";

import "../../App.css";

const SignIn = () => {
  const [alert, setAlert] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [passwordErr, setPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const navigation = useNavigate();

  const { state, dispatch } = useAuth();

  useEffect(() => {
    if (!state.user.isConfirmed && state.token) {
      navigation("/signup-confirm");
    }
  }, [state.user.isConfirmed, state.token, navigation]);

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(email);
  }, [email]);

  const checkPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(password);
  }, [password]);

  useEffect(() => {
    if (checkPasswordValidity || checkEmailValidity) {
      setIsDisabled(false);
    }
  }, [checkPasswordValidity, checkEmailValidity]);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setPasswordErr({ result: false, message: "Введіть правильний пароль" });
    } else {
      setPasswordErr({
        result: checkPasswordValidity,
        message: checkPasswordValidity ? "" : "Введіть правильний пароль",
      });
    }

    setEmailErr({
      result: checkEmailValidity,
      message: checkEmailValidity ? "" : "Введіть правильний email",
    });

    try {
      if (emailErr.result && passwordErr.result) {
        console.log("Використовуємо fetch");
        const res = await fetch("http://localhost:4000/signin", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch({ type: "LOGIN", ...data.userData });
          setPasswordErr({
            result: true,
            message: "",
          });

          setEmailErr({
            result: true,
            message: "",
          });

          setAlert("");
          setIsDisabled(false);
          navigation("/balance");
        } else {
          setAlert(data.message);
          setIsDisabled(true);
        }
      } else {
        setAlert("Заповніть всі поля");
        setIsDisabled(true);
      }
    } catch (err: any) {
      console.log(err);
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
        <BackButton />
      </header>

      <main className="main">
        <div className="heading">
          <Title title="Sign in" description="Select login method" />
        </div>

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
          value={password}
          setValue={setPassword}
          error={passwordErr}
        />
        <div>
          Забули пароль?{"     "}
          <Link to="/recovery" className="signup-link">
            Restore
          </Link>
        </div>
        <Button
          text="Continue"
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

export default SignIn;
