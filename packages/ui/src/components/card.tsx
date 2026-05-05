import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-white rounded-2xl border border-[#DCC8B0] shadow-sm",
        hover ? "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["px-6 py-4 border-b border-[#F0E6D8]", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["px-6 py-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["px-6 py-4 border-t border-[#F0E6D8]", className].join(" ")} {...props}>
      {children}
    </div>
  );
}
