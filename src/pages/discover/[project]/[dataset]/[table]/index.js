import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from "react";
import Layout from "../../../../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import axios from "axios";
import Spreadsheet from "react-spreadsheet";

function Table() {
  const router = useRouter();

  const { project, dataset, table } = router.query;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [columns, setColumns] = useState(null);
  const [spreadsheetData, setSpreadsheetData] = useState(null);

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
          let spreadsheetData = [];
          spreadsheetData.push([
            {
              value: "Nome da coluna",
              className: "fw-bold text-center",
              readOnly: true
            },
            { value: "Tipo", className: "fw-bold text-center", readOnly: true },
            {
              value: "Descrição",
              className: "fw-bold text-center",
              readOnly: true
            },
            {
              value: "Observações",
              className: "fw-bold text-center",
              readOnly: true
            },
            {
              value: "Nome original da coluna",
              className: "fw-bold text-center",
              readOnly: true
            }
          ]);
          data[0].columns.forEach((column) => {
            let columnData = [];
            columnData.push({
              value: column.name,
              className: "text-center"
            });
            columnData.push({
              value: column.type,
              className: "text-center"
            });
            columnData.push({
              value: column.description,
              className: "text-center"
            });
            columnData.push({
              value: column.comments,
              className: "text-center"
            });
            columnData.push({
              value: column.original_name,
              className: "text-center"
            });
            spreadsheetData.push(columnData);
          });
          setSpreadsheetData(spreadsheetData);
        } else {
          setColumns([]);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, [project, dataset, table]);

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
            {spreadsheetData !== null && (
              <div className="p-3 table-responsive">
                <Spreadsheet
                  data={spreadsheetData}
                  onChange={setSpreadsheetData}
                />
              </div>
            )}
            <div className="row p-3">
              {columns && columns.length === 0 && (
                <div className="col-md-12">
                  <div className="card mt-4">
                    <div className="p-3">
                      <h2 className="card-title fw-bold">
                        Nenhuma coluna encontrada! 😭
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
  }, [
    loading,
    isAuthenticated,
    router,
    columns,
    project,
    dataset,
    table,
    spreadsheetData
  ]);

  return (
    <Layout pageName="Dashboard" content="Dashboard page for Metadados Rio">
      {content}
    </Layout>
  );
}

export default Table;
