import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { check_auth_status } from "../actions/auth";
import { SITE_NAME } from "../config";
import Head from "next/head";
import Navbar from "../components/Navbar";

const Layout = ({ pageName, content, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(check_auth_status());
    }
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>
          {SITE_NAME}
          {pageName && pageName !== "" && pageName !== undefined
            ? ` | ${pageName}`
            : ""}
        </title>
        <meta name="description" content={content} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Navbar />
      <div className="container mt-5">{children}</div>
    </>
  );
};

Layout.defaultProps = {
  pageName: "",
  content: "Home page for Metadados Rio"
};

export default Layout;
