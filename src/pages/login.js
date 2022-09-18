import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { login, resetRegisterSuccess } from "../actions/auth";
import Layout from "../hocs/Layout";
import { Oval } from "react-loader-spinner";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const errorMessage = useSelector((state) => state.auth.errorMessages.login);

  const [errorHeading, setErrorHeading] = useState(<></>);

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  useEffect(() => {
    if (errorMessage !== "") {
      setErrorHeading(
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      );
      window.scrollTo(0, 0);
    } else {
      setErrorHeading(<></>);
    }
  }, [errorMessage]);

  const { username, password } = formData;

  useEffect(() => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(resetRegisterSuccess);
    }
  }, [dispatch]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(login(username, password));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <Layout pageName="Login" content="Login page for Metadados Rio">
      <h1 className="display-4 mt-5 font-Poppins font-normal">Página Login</h1>
      <div className="mt-5">{errorHeading}</div>
      <form className="bg-[#fff] p-5 mt-5 mb-5 drop-shadow-xl rounded-lg" onSubmit={onSubmit}>
        <h3>Preencha os campos</h3>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="username">
            <strong>Usuário *</strong>
          </label>
          <input
            className="form-control"
            type="text"
            name="username"
            placeholder="Digite o seu Usuário"
            onChange={onChange}
            value={username}
            required
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="password">
            <strong>Senha *</strong>
          </label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Digite sua senha"
            onChange={onChange}
            value={password}
            required
          ></input>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center mt-5">
            <Oval color="#00BFFF" width={50} height={50} />
          </div>
        ) : (
          <button className="mt-5 border-2 bg-blue-600 rounded-lg px-5 py-2 hover:bg-blue-800 hover:text-white drop-shadow-md" type="submit">
            Login
          </button>
        )}
      </form>
    </Layout>
  );
};

export default LoginPage;
