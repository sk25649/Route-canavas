import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RunCanvas - Draw Your Running Routes",
  description: "Create and share running routes with live distance tracking and GPX export",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
