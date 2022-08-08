import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../hocs/Layout";
import { Oval } from "react-loader-spinner";

const Dashboard = () => {
  const router = useRouter();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);

  useEffect(() => {
    if (loading) {
      setContent(
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Oval color="#00BFFF" width={50} height={50} />
        </div>
      );
    } else if (isAuthenticated) {
      setContent(
        <div className="p-5 bg-light rounded-3">
          <div className="container-fluid py-3">
            <h1 className="display-5 fw-bold">User Dashboard</h1>
            <p className="fs-4 mt-3">
              Welcome, {user !== null && user.first_name}!
            </p>
          </div>
        </div>
      );
    } else {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router, user]);

  return (
    <Layout
      title="Metadados Rio | Dashboard"
      content="Dashboard page for Metadados Rio"
    >
      {content}
    </Layout>
  );
};

export default Dashboard;
