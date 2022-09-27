import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from "react";
import Layout from "../../../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import axios from "axios";

function Dataset() {
  const router = useRouter();

  const { project, dataset } = router.query;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [tables, setTables] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);

  useEffect(() => {
    axios
      .get("/api/meta/datasets/?project=" + project + "&name=" + dataset)
      .then((response) => {
        const data = response.data;
        if (
          data.length > 0 &&
          data[0].tables !== undefined &&
          data[0].tables.length > 0
        ) {
          setTables(data[0].tables);
          setDatasetInfo(data[0]);
        } else {
          setTables([]);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, [project, dataset]);

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
            <h1 className="display-6 fw-bold">
              Dataset {dataset}
              <button
                className="ml-2 h6 border-2 bg-blue-600 rounded-lg px-6 py-2 hover:bg-blue-800 hover:text-white drop-shadow-md"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseForm"
                aria-expanded="false"
                aria-controls="collapseForm"
              >
                Editar
              </button>
            </h1>
          </div>
          <div className="container-fluid">
            {datasetInfo && (
              <div className="collapse" id="collapseForm">
                <form className="row g-3" action="#">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={datasetInfo.name}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="title_prefix" className="form-label">
                      Prefixo de título de tabelas
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title_prefix"
                      value={datasetInfo.title_prefix}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="project" className="form-label">
                      Projeto
                    </label>
                    <select
                      className="form-select"
                      aria-label="Projeto"
                      id="project"
                    >
                      <option selected value={datasetInfo.project}>
                        project1
                      </option>
                      <option value="project2">project2</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <button
                      type="submit"
                      className="mt-3 border-2 bg-blue-600 rounded-lg px-6 py-2 hover:bg-blue-800 hover:text-white drop-shadow-md"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="container-fluid mt-5">
            <h1 className="display-6 fw-bold">Lista de tabelas</h1>
            <div className="row p-3">
              {tables &&
                tables.map((tables) => (
                  <div key={tables.name} className="col-md-4">
                    <div className="card mt-4">
                      <Link
                        href={`/discover/${project}/${dataset}/${tables.name}`}
                      >
                        <div className="btn btn-primary">
                          <div className="p-3">
                            <h2 className="card-title fw-bold">
                              {tables.name}
                            </h2>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              {tables && tables.length === 0 && (
                <div className="col-md-12">
                  <div className="card mt-4">
                    <div className="p-3">
                      <h2 className="card-title fw-bold">
                        Nenhuma tabela encontrada! 😭
                      </h2>
                    </div>
                  </div>
                </div>
              )}
              {!tables && (
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
  }, [loading, isAuthenticated, router, tables, project, dataset, datasetInfo]);

  return (
    <Layout pageName="Dashboard" content="Dashboard page for Metadados Rio">
      {content}
    </Layout>
  );
}

export default Dataset;
