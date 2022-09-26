import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from "react";
import Layout from "../../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import axios from "axios";

function Projeto() {
  const router = useRouter();

  const { project } = router.query;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [datasets, setDatasets] = useState(null);
  useEffect(() => {
    axios
      .get("/api/meta/projects/?name=" + project)
      .then((response) => {
        const data = response.data;
        if (
          data.length > 0 &&
          data[0].datasets !== undefined &&
          data[0].datasets.length > 0
        ) {
          setDatasets(data[0].datasets);
        } else {
          setDatasets([]);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, [project, datasets]);

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
            <h1 className="display-6 fw-bold">Datasets</h1>
          </div>
          <div className="container-fluid">
            <div className="row p-3">
              {datasets &&
                datasets.map((datasets) => (
                  <div key={datasets.name} className="col-md-4">
                    <div className="card mt-4">
                      <Link href={`/discover/${project}/${datasets.name}`}>
                        <div className="btn btn-primary">
                          <div className="p-3">
                            <h2 className="card-title fw-bold">
                              {datasets.name}
                            </h2>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              {datasets && datasets.length === 0 && (
                <div className="col-md-12">
                  <div className="card mt-4">
                    <div className="p-3">
                      <h2 className="card-title fw-bold">
                        Nenhum dataset encontrado! 😭
                      </h2>
                    </div>
                  </div>
                </div>
              )}
              {!datasets && (
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
  }, [loading, isAuthenticated, router, datasets, project]);

  return (
    <Layout pageName="Dashboard" content="Dashboard page for Metadados Rio">
      {content}
    </Layout>
  );
}

export default Projeto;
