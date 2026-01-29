import Footer from "@/components/Footer";
import FooterNav from "@/components/FooterNav";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

const Layout = ({ children }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []); // Added dependency array


  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FooterNav />
    </>
  );
};

export default Layout;

