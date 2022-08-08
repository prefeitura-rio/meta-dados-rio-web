import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from "react";
import Layout from "../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import { API_URL } from "../../config";

const Discover = () => {
  const router = useRouter();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/meta/projects");
      const data = await res.json();
      setProjects(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) {
      setContent(
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Oval color="#00BFFF" width={50} height={50} />
        </div>
      );
    } else if (isAuthenticated) {
      setContent(
        <div className="p-3 bg-light rounded-3">
          <div className="container-fluid py-3">
            <h1 className="display-6 fw-bold">Projetos</h1>
          </div>
          <div className="container-fluid">
            <div className="row p-3">
              {projects.map((project) => (
                <div key={project.name} className="col-md-4">
                  <div className="card mt-4">
                    <div className="btn btn-primary">
                      <div className="p-3">
                        <h2 className="card-title fw-bold">{project.name}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router, projects]);

  return (
    <Layout pageName="Dashboard" content="Dashboard page for Metadados Rio">
      {content}
    </Layout>
  );
};

export default Discover;
