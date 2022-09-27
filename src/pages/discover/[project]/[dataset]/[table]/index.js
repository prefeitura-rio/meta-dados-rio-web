import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import Layout from "../../../../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import Spreadsheet from "react-spreadsheet";
import convertUrlToInternal from "../../../../../utils/convertUrl";
import { add_alert, remove_alert } from "../../../../../actions/alert";

function Table() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { project, dataset, table } = router.query;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [datasets, setDatasets] = useState(null);
  const [tags, setTags] = useState(null);
  const [categories, setCategories] = useState(null);
  const [columns, setColumns] = useState(null);
  const [columnsUpdate, setColumnsUpdate] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [tableInfoEdited, setTableInfoEdited] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState(null);

  useEffect(() => {
    console.log(columns);
  }, [columns]);

  useEffect(() => {
    console.log(columnsUpdate);
  }, [columnsUpdate]);

  useEffect(() => {
    if (spreadsheetData) {
      let columnsCopy = [...columns];
      // Iterate over each row, starting at 1 to skip the header row
      for (let i = 1; i < spreadsheetData.length; i++) {
        // Check if all cells in the row are empty
        if (
          spreadsheetData[i].every((cell) => !cell || (cell && !cell.value))
        ) {
          // If so, skip to the next row
          continue;
        }
        if (i - 1 < columnsCopy.length) {
          // Replace attributes
          if (spreadsheetData[i][0]) {
            columnsCopy[i - 1].name = spreadsheetData[i][0].value;
          } else {
            columnsCopy[i - 1].name = "";
          }
          if (spreadsheetData[i][1]) {
            columnsCopy[i - 1].type = spreadsheetData[i][1].value;
          } else {
            columnsCopy[i - 1].type = "";
          }
          if (spreadsheetData[i][2]) {
            columnsCopy[i - 1].description = spreadsheetData[i][2].value;
          } else {
            columnsCopy[i - 1].description = "";
          }
          if (spreadsheetData[i][3]) {
            columnsCopy[i - 1].comments = spreadsheetData[i][3].value;
          } else {
            columnsCopy[i - 1].comments = "";
          }
          if (spreadsheetData[i][4]) {
            columnsCopy[i - 1].original_name = spreadsheetData[i][4].value;
          } else {
            columnsCopy[i - 1].original_name = "";
          }
        } else {
          // Add new entries
          let newColumn = {
            name: "",
            type: "",
            description: "",
            comments: "",
            original_name: ""
          };
          if (spreadsheetData[i][0]) {
            newColumn.name = spreadsheetData[i][0].value;
          }
          if (spreadsheetData[i][1]) {
            newColumn.type = spreadsheetData[i][1].value;
          }
          if (spreadsheetData[i][2]) {
            newColumn.description = spreadsheetData[i][2].value;
          }
          if (spreadsheetData[i][3]) {
            newColumn.comments = spreadsheetData[i][3].value;
          }
          if (spreadsheetData[i][4]) {
            newColumn.original_name = spreadsheetData[i][4].value;
          }
          columnsCopy.push(newColumn);
        }
      }
      setColumnsUpdate(columnsCopy);
    }
  }, [spreadsheetData, columns]);

  useEffect(() => {
    axios
      .get("/api/meta/datasets/")
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
          setDatasets(data);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/meta/tags/")
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
          setTags(data);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/meta/categories/")
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
          setCategories(data);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, []);

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
        if (data.length > 0) {
          setTableInfo(data[0]);
          if (data[0].columns !== undefined && data[0].columns.length > 0) {
            data[0].columns.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });
            setColumns(data[0].columns);
          } else {
            setColumns([]);
          }
          let spreadsheetData = [];
          spreadsheetData.push([
            {
              value: "Nome da coluna",
              className: "fw-bold text-center",
              readOnly: true
            },
            {
              value: "Tipo",
              className: "fw-bold text-center",
              readOnly: true
            },
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
          console.error("Table not found");
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, [project, dataset, table]);

  useEffect(() => {
    // Delay to avoid infinite loop
    setTimeout(() => {
      // Check if there's data in the last row of the spreadsheet
      if (spreadsheetData) {
        let lastRow = spreadsheetData[spreadsheetData.length - 1];
        let lastRowEmpty = true;
        lastRow.forEach((cell) => {
          if (cell && cell.value) {
            lastRowEmpty = false;
          }
        });
        if (!lastRowEmpty) {
          setSpreadsheetData([
            ...spreadsheetData,
            [
              { value: null, className: "text-center" },
              { value: null, className: "text-center" },
              { value: null, className: "text-center" },
              { value: null, className: "text-center" },
              { value: null, className: "text-center" }
            ]
          ]);
        }
      }
    }, 100);
  }, [spreadsheetData]);

  useEffect(() => {
    if (tableInfoEdited && dispatch !== undefined) {
      dispatch(
        add_alert(
          "tableInfoEdited",
          "As informações da tabela foram editadas. Clique em salvar para confirmar as alterações.",
          "warning"
        )
      );
    } else {
      dispatch(remove_alert("tableInfoEdited"));
    }
  }, [tableInfoEdited, dispatch]);

  useEffect(() => {
    const onChange = (e) => {
      switch (e.target.id) {
        case "categories":
          let currentCategories = [...tableInfo.categories];
          if (currentCategories.includes(e.target.value)) {
            currentCategories = currentCategories.filter(
              (category) => category !== e.target.value
            );
          } else {
            currentCategories.push(e.target.value);
          }
          setTableInfo({
            ...tableInfo,
            categories: currentCategories
          });
          setTableInfoEdited(true);
          break;
        case "tags":
          let currentTags = [...tableInfo.tags];
          if (currentTags.includes(e.target.value)) {
            currentTags = currentTags.filter((tag) => tag !== e.target.value);
          } else {
            currentTags.push(e.target.value);
          }
          setTableInfo({
            ...tableInfo,
            tags: currentTags
          });
          setTableInfoEdited(true);
          break;
        default:
          setTableInfo({ ...tableInfo, [e.target.id]: e.target.value });
          setTableInfoEdited(true);
          break;
      }
    };
    const onSubmit = (e) => {
      e.preventDefault();
      axios
        .put(convertUrlToInternal(tableInfo.url), tableInfo)
        .then((response) => {
          setTableInfoEdited(false);
          let currentDataset = datasets.filter(
            (dataset) => dataset.url === tableInfo.dataset
          )[0];
          router.push(
            "/discover/" +
              project +
              "/" +
              currentDataset.name +
              "/" +
              response.data.name
          );
        })
        .catch((error) => {
          console.error(error);
        });
    };
    const saveColumns = (e) => {
      e.preventDefault();
      let errors = 0;
      let newColumns = [];
      let editedColumns = [];
      columnsUpdate.forEach((columnUpdate) => {
        // If there's an URL, it means the column already exists
        if (columnUpdate.url) {
          editedColumns.push(columnUpdate);
        } else {
          newColumns.push(columnUpdate);
        }
      });
      // For each edited column, make a PUT request
      editedColumns.forEach((column) => {
        axios
          .put(convertUrlToInternal(column.url), column)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            errors += 1;
          });
      });
      // For each new column, make a POST request
      newColumns.forEach((column) => {
        axios
          .post("/api/meta/columns", {
            ...column,
            table: tableInfo.url
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            errors += 1;
          });
      });
      // Refresh page to get the new columns (if no errors)
      if (errors === 0) {
        router.reload();
      } else {
        console.error("Failed to save columns");
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
                <form className="row g-3" onSubmit={onSubmit}>
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
                      value={tableInfo.update_frequency}
                      required
                    >
                      <option value="Nunca">Nunca</option>
                      <option value="Diário">Diário</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Mensal">Mensal</option>
                      <option value="Anual">Anual</option>
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
                      value={tableInfo.tags}
                    >
                      {tags &&
                        tags.map((tag) => (
                          <option key={tag.id} value={tag.name}>
                            {tag.name}
                          </option>
                        ))}
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
                      value={tableInfo.categories}
                    >
                      {categories &&
                        categories.map((category) => (
                          <option key={category.id} value={category.path}>
                            {category.name}
                          </option>
                        ))}
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
                      value={tableInfo.dataset}
                      required
                    >
                      {datasets &&
                        datasets.map((dataset) => (
                          <option key={dataset.id} value={dataset.url}>
                            {dataset.name}
                          </option>
                        ))}
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
            <h1 className="display-6 fw-bold">
              Colunas
              <button
                className="ml-2 h6 border-2 bg-blue-600 rounded-lg px-6 py-2 hover:bg-blue-800 hover:text-white drop-shadow-md"
                type="button"
                aria-expanded="false"
                onClick={saveColumns}
              >
                Salvar
              </button>
            </h1>
            {spreadsheetData !== null && (
              <div className="p-3 table-responsive">
                <Spreadsheet
                  data={spreadsheetData}
                  onChange={setSpreadsheetData}
                />
              </div>
            )}
            <div className="row p-3">
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
    spreadsheetData,
    datasets,
    tags,
    categories,
    columnsUpdate
  ]);

  return (
    <Layout pageName="Dashboard" content="Dashboard page for Metadados Rio">
      {content}
    </Layout>
  );
}

export default Table;
