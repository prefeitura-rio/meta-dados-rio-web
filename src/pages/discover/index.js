import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from "react";
import Layout from "../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import axios from "axios";

const Discover = () => {
  const router = useRouter();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    axios
      .get("/api/meta/projects")
      .then((response) => {
        const data = response.data;
        if (data.length > 0) {
          data.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
          setProjects(data);
        } else {
          setProjects([]);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
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
              {projects &&
                projects.map((projects) => (
                  <div key={projects.name} className="col-md-4">
                    <div className="card mt-4">
                      <Link href={`/discover/${projects.name}`}>
                        <div className="btn btn-primary">
                          <div className="p-3">
                            <h2 className="card-title fw-bold">
                              {projects.name}
                            </h2>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              {projects && projects.length === 0 && (
                <div className="col-md-12">
                  <div className="card mt-4">
                    <div className="p-3">
                      <h2 className="card-title fw-bold">
                        Nenhum projeto encontrado! 😭
                      </h2>
                    </div>
                  </div>
                </div>
              )}
              {!projects && (
                <div className="col-md-12">
                  <Oval color="#00BFFF" width={30} height={30} />
                </div>
              )}
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
