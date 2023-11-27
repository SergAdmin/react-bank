import { Link } from "react-router-dom";
import "./index.css";

interface ButtonProps {
  text: string;
  modification?: string;
  href?: string;
  disabled?: boolean;
  type: "nav" | "submit";
  action?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  modification,
  href,
  type,
  action,
  disabled,
}) => {
  switch (type) {
    case "nav":
      return href ? (
        <Link
          to={href}
          className={`button ${modification ? `button--${modification}` : ""} ${
            disabled ? "disabled" : ""
          }`}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
          {text}
        </Link>
      ) : (
        <div>Error</div>
      );

    case "submit":
      return (
        <div
          onClick={action}
          className={`button ${modification ? `button--${modification}` : ""} ${
            disabled ? "disabled" : ""
          }`}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
          {text}
        </div>
      );
  }
};

export default Button;
