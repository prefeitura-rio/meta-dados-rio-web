import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { register } from "../actions/auth";
import Layout from "../hocs/Layout";
import { Oval } from "react-loader-spinner";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const registerSuccess = useSelector((state) => state.auth.registerSuccess);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const errorMessage = useSelector(
    (state) => state.auth.errorMessages.register
  );

  const [errorHeading, setErrorHeading] = useState(<></>);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    re_password: "",
    registration_token: ""
  });

  const {
    first_name,
    last_name,
    username,
    email,
    password,
    re_password,
    registration_token
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(
        register(
          first_name,
          last_name,
          username,
          email,
          password,
          re_password,
          registration_token
        )
      );
    }
  };

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

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (registerSuccess) {
      router.push("/login");
    }
  }, [registerSuccess, router]);

  return (
    <Layout pageName="Register" content="Register page for Metadados Rio">
      <h1 className="display-4 mt-5">Página de Registro</h1>
      <div className="mt-5">{errorHeading}</div>
      <form className="bg-[#fff] p-5 mt-5 mb-5 drop-shadow-xl rounded-lg" onSubmit={onSubmit}>
        <h3>Crie sua conta</h3>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="first_name">
            <strong>Primeiro Nome *</strong>
          </label>
          <input
            className="form-control"
            type="text"
            name="first_name"
            placeholder="Primeiro Nome"
            onChange={onChange}
            value={first_name}
            required
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="last_name">
            <strong>Sobrenome *</strong>
          </label>
          <input
            className="form-control"
            type="text"
            name="last_name"
            placeholder="Sobrenome"
            onChange={onChange}
            value={last_name}
            required
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="username">
            <strong>Usuário *</strong>
          </label>
          <input
            className="form-control"
            type="text"
            name="username"
            placeholder="Usuário"
            onChange={onChange}
            value={username}
            required
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="email">
            <strong>Email *</strong>
          </label>
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            onChange={onChange}
            value={email}
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
            placeholder="Senha"
            onChange={onChange}
            value={password}
            required
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="re_password">
            <strong>Reescreva sua Senha *</strong>
          </label>
          <input
            className="form-control"
            type="password"
            name="re_password"
            placeholder="Reescreva sua senha"
            onChange={onChange}
            value={re_password}
            required
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="registration_token">
            <strong>Registration Token *</strong>
          </label>
          <input
            className="form-control"
            type="text"
            name="registration_token"
            placeholder="Registration Token"
            onChange={onChange}
            value={registration_token}
            required
          ></input>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center mt-5">
            <Oval color="#00BFFF" width={50} height={50} />
          </div>
        ) : (
          <button className="mt-5 border-2 bg-blue-600 rounded-lg px-5 py-2 hover:bg-blue-800 hover:text-white drop-shadow-md" type="submit">
            Create Account
          </button>
        )}
      </form>
    </Layout>
  );
};

export default RegisterPage;
