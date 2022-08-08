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
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }),
    [isAuthenticated, router];

  useEffect(() => {
    if (registerSuccess) {
      router.push("/login");
    }
  }),
    [registerSuccess, router];

  return (
    <Layout pageName="Register" content="Register page for Metadados Rio">
      <h1 className="display-4 mt-5">Register Page</h1>
      <form className="bg-light p-5 mt-5 mb-5" onSubmit={onSubmit}>
        <h3>Create An Account</h3>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="first_name">
            <strong>First Name *</strong>
          </label>
          <input
            className="form-control"
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={onChange}
            value={first_name}
            required
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="last_name">
            <strong>Last Name *</strong>
          </label>
          <input
            className="form-control"
            type="text"
            name="last_name"
            placeholder="Last Name"
            onChange={onChange}
            value={last_name}
            required
          ></input>
        </div>
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
        <div className="form-group">
          <label className="form-label mt-5" htmlFor="re_password">
            <strong>Re-enter Password *</strong>
          </label>
          <input
            className="form-control"
            type="password"
            name="re_password"
            placeholder="Re-enter Password"
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
          <button className="btn btn-primary mt-5" type="submit">
            Create Account
          </button>
        )}
      </form>
    </Layout>
  );
};

export default RegisterPage;
