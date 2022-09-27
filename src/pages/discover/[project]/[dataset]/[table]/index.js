import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from "react";
import Layout from "../../../../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import Spreadsheet from "react-spreadsheet";

function Table() {
  const router = useRouter();

  const { project, dataset, table } = router.query;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [columns, setColumns] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
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
          setTableInfo(data[0]);
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
    const onChange = (e) => {
      switch (e.target.id) {
        case "categories":
          break;
        case "dataset":
          break;
        case "tags":
          break;
        case "update_frequency":
          break;
        default:
          setTableInfo({ ...tableInfo, [e.target.id]: e.target.value });
          break;
      }
    };
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
              Tabela {table}
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
            {tableInfo && (
              <div className="collapse" id="collapseForm">
                <form className="row g-3" action="#">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      <strong>Nome *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      onChange={onChange}
                      value={tableInfo.name}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="title" className="form-label">
                      <strong>Título da tabela *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      onChange={onChange}
                      value={tableInfo.title}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="short_description" className="form-label">
                      <strong>Descrição curta *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="short_description"
                      onChange={onChange}
                      value={tableInfo.short_description}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="long_description" className="form-label">
                      <strong>Descrição longa *</strong>
                    </label>
                    <textarea
                      className="form-control"
                      id="long_description"
                      onChange={onChange}
                      value={tableInfo.long_description}
                      required
                      rows="3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="update_frequency" className="form-label">
                      <strong>Frequência de atualização *</strong>
                    </label>
                    <select
                      className="form-select"
                      aria-label="Frequência de atualização"
                      id="update_frequency"
                      onChange={onChange}
                      required
                    >
                      <option selected value={tableInfo.update_frequency}>
                        {tableInfo.update_frequency}
                      </option>
                      <option value="aaaa">aaaa</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="temporal_coverage" className="form-label">
                      <strong>Cobertura temporal *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="temporal_coverage"
                      onChange={onChange}
                      value={tableInfo.temporal_coverage}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="data_owner" className="form-label">
                      <strong>Órgão responsável pelo dado *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="data_owner"
                      onChange={onChange}
                      value={tableInfo.data_owner}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="publisher_name" className="form-label">
                      <strong>Nome do publicador *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="publisher_name"
                      onChange={onChange}
                      value={tableInfo.publisher_name}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="publisher_email" className="form-label">
                      <strong>E-mail do publicador *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="publisher_email"
                      onChange={onChange}
                      value={tableInfo.publisher_email}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="source_database" className="form-label">
                      <strong>Banco de dados de origem *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="source_database"
                      onChange={onChange}
                      value={tableInfo.source_database}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="source_table" className="form-label">
                      <strong>Tabela de origem *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="source_table"
                      onChange={onChange}
                      value={tableInfo.source_table}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="source_query" className="form-label">
                      <strong>Query de extração *</strong>
                    </label>
                    <textarea
                      className="form-control"
                      id="source_query"
                      onChange={onChange}
                      value={tableInfo.source_query}
                      required
                      rows="3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="tags" className="form-label">
                      Tags
                    </label>
                    <select
                      className="form-select"
                      multiple
                      aria-label="Tags"
                      id="tags"
                      onChange={onChange}
                    >
                      <option selected value={tableInfo.tags}>
                        {tableInfo.tags}
                      </option>
                      <option value="aaaa">aaaa</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="categories" className="form-label">
                      Categorias
                    </label>
                    <select
                      className="form-select"
                      multiple
                      aria-label="Categorias"
                      id="categories"
                      onChange={onChange}
                    >
                      <option selected value={tableInfo.categories}>
                        {tableInfo.categories}
                      </option>
                      <option value="aaaa">aaaa</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dataset" className="form-label">
                      <strong>Dataset *</strong>
                    </label>
                    <select
                      className="form-select"
                      aria-label="Dataset"
                      id="dataset"
                      onChange={onChange}
                      required
                    >
                      <option selected value={tableInfo.dataset}>
                        {tableInfo.dataset}
                      </option>
                      <option value="aaaa">aaaa</option>
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
            <h1 className="display-6 fw-bold">Colunas</h1>
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
    tableInfo,
    spreadsheetData
  ]);

  return (
    <Layout pageName="Dashboard" content="Dashboard page for Metadados Rio">
      {content}
    </Layout>
  );
}

export default Table;
