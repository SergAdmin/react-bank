// На цій сторінці ми створюємо верстку та розміщуємо дві
// кнопки-посилання на сторінку /signup та сторінку /signin

import Button from "../../container/Button";

import Title from "../../container/Title";
import StatusBar from "../../container/StatusBar";

import "../../App.css";

const WelcomePage = () => {
  return (
    <div className="main-page">
      <div className="welcome">
        <StatusBar type="white" />
        <div className="title__block">
          <Title title="Hello" description="Welcome to bank app" />
        </div>
      </div>

      <div className="welcome__storage" />

      <div className="buttons-container">
        <Button text="Sign up" href="/signup" type="nav" />
        <Button
          text="Sign in"
          modification="secondary"
          href="/signin"
          type="nav"
        />
      </div>
    </div>
  );
};

export default WelcomePage;
