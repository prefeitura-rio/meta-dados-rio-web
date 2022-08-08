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

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

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
  }),
    [isAuthenticated, router];

  return (
    <Layout pageName="Login" content="Login page for Metadados Rio">
      <h1 className="display-4 mt-5">Login Page</h1>
      <form className="bg-light p-5 mt-5 mb-5" onSubmit={onSubmit}>
        <h3>Log Into Your Account</h3>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="username">
            <strong>Username *</strong>
          </label>
          <input
            className="form-control"
            type="text"
            name="username"
            placeholder="Username"
            onChange={onChange}
            value={username}
            required
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="password">
            <strong>Password *</strong>
          </label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Password"
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
          <button className="btn btn-primary mt-5" type="submit">
            Login
          </button>
        )}
      </form>
    </Layout>
  );
};

export default LoginPage;
