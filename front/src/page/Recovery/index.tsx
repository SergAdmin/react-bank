//Сторінка відновлення акаунту. Після вводу пошти, створюється
//код з підтвердженням відновлення акаунту, переводимо на
//сторінку /recovery-confirm

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

const Recovery = () => {
  const [email, setEmail] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const { dispatch } = useAuth();

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(email);
  }, [email]);

  useEffect(() => {
    if (checkEmailValidity) {
      setIsDisabled(false);
    }
  }, [checkEmailValidity]);

  const navigation = useNavigate();

  const handleSubmit = async () => {
    setEmailErr({
      result: checkEmailValidity,
      message: checkEmailValidity ? "" : "Введіть правильний email",
    });

    try {
      if (emailErr.result) {
        const res = await fetch("http://localhost:4000/recovery", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        const data = await res.json();
        if (res.ok) {
          dispatch({ type: "LOGIN", email: email });

          setEmailErr({
            result: true,
            message: "",
          });

          navigation("/recovery-confirm");
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
          type="email"
          name="Email"
          value={email}
          setValue={setEmail}
          error={emailErr}
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

export default Recovery;
