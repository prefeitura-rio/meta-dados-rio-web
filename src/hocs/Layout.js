import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { check_auth_status } from "../actions/auth";
import { SITE_NAME } from "../config";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import BreadcrumbItem from "../components/BreadcrumbItem";

const Layout = ({ pageName, content, children }) => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(check_auth_status());
    }
  }, [dispatch]);

  useEffect(() => {
    if (router && router !== null && router !== undefined) {
      // Adapted from
      // https://blog.anishde.dev/making-an-accessible-breadcrumb-navigation-using-tailwindcss-and-nextjs
      const pathWithoutQuery = router.asPath.split("?")[0];
      let pathArray = pathWithoutQuery.split("/");
      pathArray.shift();
      pathArray = pathArray.filter((path) => path !== "");
      const breadcrumbs = pathArray.map((path, index) => {
        const href = "/" + pathArray.slice(0, index + 1).join("/");
        return {
          href,
          label: path.charAt(0).toUpperCase() + path.slice(1)
        };
      });
      setBreadcrumbs(breadcrumbs);
    }
  }, [router]);

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
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        {breadcrumbs &&
          breadcrumbs.map((breadcrumb) => (
            <BreadcrumbItem key={breadcrumb.href} href={breadcrumb.href}>
              {breadcrumb.label}
            </BreadcrumbItem>
          ))}
      </Breadcrumb>
      <div className="container mt-5">{children}</div>
    </>
  );
};

Layout.defaultProps = {
  pageName: "",
  content: "Home page for Metadados Rio"
};

export default Layout;
