import React from "react";
import "./index.css";

interface TitleProps {
  title: String;
  description?: String;
  colorTitle?: "black" | "light" | "grey";
  colorDescription?: "black" | "light" | "grey";
}

const Title: React.FC<TitleProps> = ({
  title,
  description,
  colorTitle,
  colorDescription,
}) => {
  const desc = <p className="page__text">{description}</p>;
  let src;

  if (!description) {
  } else {
    src = desc;
  }

  return (
    <div className="page__info">
      <h1 className="page__title">{title}</h1>

      {src}
    </div>
  );
};

export default Title;
