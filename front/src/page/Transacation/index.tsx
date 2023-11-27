// Сторінка з детальною інформацією про конкретну транзакцію.
// В сторінці є trainsactionId, який вказує на ідентифікатор
// транзакції, який використовується для отримання та виводи
// інформації про конкретну транзакцію. Перехід на цю сторінку
// здійснюється через натискання на карточку транзакції на
// сторінці  /balance

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackBtn from "../../container/BackArrow";
import { TransactionsObject } from "../../utilits/TransactionObject";

import Title from "../../container/Title";
import StatusBar from "../../container/StatusBar";

import getDate from "../../utilits/GetDate";

import "../../App.css";

const Transaction = () => {
  const [transaction, setTransaction] = useState<TransactionsObject>();

  const { id, token } = useParams();

  console.log(id, token);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/transaction?token=${token}&id=${id}`,
        { method: "GET" }
      );

      const data = await res.json();

      if (res.ok) {
        setTransaction(data.transaction);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(transaction);
    fetchData();
  }, []);
  return (
    <div className="page">
      <StatusBar type="black" />
      <header className="grid__header">
        <BackBtn />
        <Title title="Transaction" />
      </header>

      <main className="main">
        <div
          className={`sum__title ${
            transaction?.type === "send" ? "send" : "receive"
          }`}
        >
          {transaction?.type === "send" ? "-$" : "+$"}
          {String(transaction?.sum).split(".")[0]}
          <span className="sum__subtitle">
            .
            {String(transaction?.sum).split(".")[1]
              ? String(transaction?.sum).split(".")[1]
              : "0"}
          </span>
        </div>

        <div className="transaction__card">
          <div className="transaction__container">
            <div className="transaction__name">Date</div>
            <div className="transaction__details">
              {transaction?.date && getDate(transaction.date)}
            </div>
          </div>

          <div className="splitter" />

          <div className="transaction__container">
            <div className="transaction__name">resEmail</div>
            <div className="transaction__details">
              {transaction?.type === "receive"
                ? transaction?.resEmail &&
                  transaction?.resEmail[0].toUpperCase() +
                    transaction?.resEmail.slice(1)
                : transaction?.resEmail}
            </div>
          </div>

          <div className="splitter" />

          <div className="transaction__container">
            <div className="transaction__name">Type</div>
            <div className="transaction__details">
              {transaction?.type && transaction?.type[0].toUpperCase()}
              {transaction?.type && transaction?.type.slice(1)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transaction;
