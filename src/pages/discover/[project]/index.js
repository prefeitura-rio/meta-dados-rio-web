import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import Layout from "../../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import axios from "axios";
import convertUrlToInternal from "../../../utils/convertUrl";
import { add_alert, remove_alert } from "../../../actions/alert";

function Projeto() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { project } = router.query;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [content, setContent] = useState(<></>);
  const [datasets, setDatasets] = useState(null);
  const [projectInfo, setProjectInfo] = useState(null);
  const [projectInfoEdited, setProjectInfoEdited] = useState(false);

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
          setProjectInfo(data[0]);
        } else {
          setDatasets([]);
        }
      })
      .catch(() => {
        console.error("Failed to fetch authenticated API");
      });
  }, [project]);

  useEffect(() => {
    if (projectInfoEdited && dispatch !== undefined) {
      dispatch(
        add_alert(
          "projectInfoEdited",
          "As informações do projeto foram editadas. Clique em salvar para confirmar as alterações.",
          "warning"
        )
      );
    } else {
      dispatch(remove_alert("projectInfoEdited"));
    }
  }, [projectInfoEdited, dispatch]);

  useEffect(() => {
    const onChange = (e) => {
      setProjectInfo({ ...projectInfo, [e.target.id]: e.target.value });
      setProjectInfoEdited(true);
    };
    const onSubmit = (e) => {
      e.preventDefault();
      axios
        .put(convertUrlToInternal(projectInfo.url), projectInfo)
        .then((response) => {
          setProjectInfoEdited(false);
          router.push("/discover/" + response.data.name);
        })
        .catch((error) => {
          console.error(error);
        });
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
              Projeto {project}
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
            {projectInfo && (
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
                      value={projectInfo.name}
                      required
                    />
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
            <h1 className="display-6 fw-bold">Lista de datasets</h1>
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
  }, [loading, isAuthenticated, router, datasets, project, projectInfo]);

  return (
    <Layout pageName="Dashboard" content="Dashboard page for Metadados Rio">
      {content}
    </Layout>
  );
}

export default Projeto;
