import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function TwoColumnSection({ children, className }: Props) {
  return (
    <section className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${className ?? ""}`}>
      {children}
    </section>
  );
}