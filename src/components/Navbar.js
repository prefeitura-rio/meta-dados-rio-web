import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/auth";
import Image from 'next/image'
import Branco from '../../public/logo-branco-horizontal.svg'

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
        <li className="nav-item">
          <Link href="/discover">
            <a
              className={
                router.pathname === "/discover" ? "nav-link active" : "nav-link"
              }
            >
              Discover
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
      { /* Campo onde podemos adicionar futuros links para convidados */ }
      </>
    ),
    userManagement: (
      <>
        <li className="nav-item font-Poppins font-semibold">
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
        <div className="h-[1px] bg-slate-600 w-[]"></div>
        <li className="nav-item font-Poppins font-semibold">
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
    <nav className="flex navbar navbar-expand-md navbar-dark bg-[#277B7B]">
      <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
        <ul className="navbar-nav me-auto">
          {isAuthenticated ? authLinks.navigation : guestLinks.navigation}
        </ul>
      </div>
      <div className="flex pl-10">
        <div className="flex justify-center items-center sm:h-[2rem] sm:w-[10rem]  2sm:h-[3rem] 2sm:w-[10rem] h-[20px] w-[150px]cursor-pointer">
          <Link href="/">
            <Image
              src={Branco}
              width={350}
            />
          </Link>
        </div>
        <div className="flex absolute right-3 items-end justify-center">
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
        
      </div>
      <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
        
        <ul className="navbar-nav ms-auto pl-10">
          
          {isAuthenticated
            ? authLinks.userManagement
            : guestLinks.userManagement}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
