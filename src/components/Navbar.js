import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const logoutHandler = () => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(logout());
    }
  };

  const authLinks = {
    navigation: (
      <>
        <li className="nav-item">
          <Link href="/">
            <a
              className={
                router.pathname === "/" ? "nav-link active" : "nav-link"
              }
            >
              Home
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/dashboard">
            <a
              className={
                router.pathname === "/dashboard"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Dashboard
            </a>
          </Link>
        </li>
      </>
    ),
    userManagement: (
      <>
        <li className="nav-item">
          <a className="nav-link" href="#!" onClick={logoutHandler}>
            Logout
          </a>
        </li>
      </>
    )
  };

  const guestLinks = {
    navigation: (
      <>
        <li className="nav-item">
          <Link href="/">
            <a
              className={
                router.pathname === "/" ? "nav-link active" : "nav-link"
              }
            >
              Home
            </a>
          </Link>
        </li>
      </>
    ),
    userManagement: (
      <>
        <li className="nav-item">
          <Link href="/register">
            <a
              className={
                router.pathname === "/register" ? "nav-link active" : "nav-link"
              }
            >
              Register
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/login">
            <a
              className={
                router.pathname === "/login" ? "nav-link active" : "nav-link"
              }
            >
              Login
            </a>
          </Link>
        </li>
      </>
    )
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
        <ul className="navbar-nav me-auto">
          {isAuthenticated ? authLinks.navigation : guestLinks.navigation}
        </ul>
      </div>
      <div className="mx-auto order-0">
        <Link href="/">
          <a className="navbar-brand mx-auto">Metadados Rio</a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target=".dual-collapse2"
          aria-controls=".dual-collapse2"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
      <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul className="navbar-nav ms-auto">
          {isAuthenticated
            ? authLinks.userManagement
            : guestLinks.userManagement}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
