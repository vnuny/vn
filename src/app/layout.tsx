import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/global.css";
import Footer from "./comps/Footer";
const inter = Inter({ subsets: ["latin"] });
import favIcon from "../../public/favIcon.png"

export const metadata: Metadata = {
  title: "VNUN",
  description: "Movie website for free movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css"></link>
        <link rel="icon" href="/favIcon.png" type="image/png" sizes="any" />
      </head>
      <body className={inter.className}>
          {children}  
        <Footer/>
      </body>
    </html>
  );
}
