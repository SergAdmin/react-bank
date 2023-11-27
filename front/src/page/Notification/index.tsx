// Сторінка списку нотифікацій, який створюються при діях:
// - Вхід в акаунт
// - Відновлення акаунту
// - Зміна пароля
// - Зміна пошти
// - Поповнення Переказ

import { useEffect, useState } from "react";
import BackBtn from "../../container/BackArrow";
import getDate from "../../utilits/GetDate";
import { useAuth } from "../../utilits/AuthContext";
import { NotificationObject } from "../../utilits/NotificationObject";

import StatusBar from "../../container/StatusBar";
import Title from "../../container/Title";

import "../../App.css";

const Notification = () => {
  const [notification, setNotification] = useState<Array<NotificationObject>>(
    []
  );

  const { state } = useAuth();
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/notification", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ token: state.token }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data.notificationList);
        setNotification(data.notificationList);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
    console.log(notification);
  }, []);
  return (
    <div className="page">
      <StatusBar type="black" />
      <header className="gridded__header">
        <BackBtn />
        <Title title="Notifications" />
      </header>

      <div className="container">
        {notification.reverse().map((item) => (
          <div className="card" key={item?.id}>
            <div
              className={`card__icon card__small ${
                item?.type === "warning" ? "card__warning" : "card__ANNOUNCE"
              }`}
            />

            <div className="card__content">
              <div className="card__title">{item?.text}</div>

              <div className="card__description">
                <div className="card__date">{getDate(item?.date as Date)}</div>
                <div className="card__type">
                  {item?.type === "warning" ? "Warning" : "ANNOUNCE"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
