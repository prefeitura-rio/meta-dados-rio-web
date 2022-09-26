import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from "react";
import Layout from "../../../../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import axios from "axios";

function Table() {
  const router = useRouter();

  const { project, dataset, table } = router.query;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [columns, setColumns] = useState(null);
  useEffect(() => {
    axios
      .get(
        "/api/meta/tables/?project=" +
          project +
          "&dataset=" +
          dataset +
          "&name=" +
          table
      )
      .then((response) => {
        const data = response.data;
        if (
          data.length > 0 &&
          data[0].columns !== undefined &&
          data[0].columns.length > 0
        ) {
          setColumns(data[0].columns);
        } else {
          setColumns([]);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, [project, dataset, table, columns]);

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
            <h1 className="display-6 fw-bold">Tabela {table}</h1>
          </div>
          <div className="container-fluid">
            <div className="row p-3">
              {columns &&
                columns.map((columns) => (
                  <div key={columns.name} className="col-md-4">
                    <div className="card mt-4">
                      <Link href={""}>
                        <div className="btn btn-primary">
                          <div className="p-3">
                            <h2 className="card-title fw-bold">
                              {columns.name}
                            </h2>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              {columns && columns.length === 0 && (
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
              {!columns && (
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
  }, [loading, isAuthenticated, router, columns, project, dataset, table]);

  return (
    <Layout pageName="Dashboard" content="Dashboard page for Metadados Rio">
      {content}
    </Layout>
  );
}

export default Table;
