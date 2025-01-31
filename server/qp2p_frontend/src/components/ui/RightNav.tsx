import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/States/store";
import { Close } from "@/States/thunks/verifySendersWallet";
import { Link } from "react-router-dom";

const Ul = styled.ul<{ open: boolean }>`
  list-style: none;
  display: flex;
  justify-content: center;
  flex-flow: row nowrap;
  align-items: center;
  color: #fff;
  // margin-left: 10rem;
  z-index: 2;

  li {
    padding: 0.75rem;
    cursor: pointer;
  }

  li > a {
    color: var(--main-color1);
  }

  @media (min-width: 768px) {
    display: none;
  }
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: #0d253b;
    position: fixed;
    transform: ${({ open }) => (open ? "translateX(0%)" : "translateX(100%)")};
    top: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    z-index: 15;

    /* width: 320px; */
    // padding-top: 3.5rem;
    // padding-buttom: -3.5rem;
    transition: transform 0.3s ease-in-out;
    justify-content: center;
    overflow-y: hidden;
    align-items: center;

    li > a {
      color: #fff;
    }
  }
`;

const RightNav = () => {
  const { burger } = useSelector((state: RootState) => state.verifyWallet);
  const dispatch: AppDispatch = useDispatch();
  return (
    <Ul open={burger} className="nav_bar">
      {/* <ul > */}
      <nav className="">
        <div className="text-white ">
          <Link to="/" className="text-2xl font-bold ">
            QP2P
          </Link>
          <ul className="my-2">
            <li>
              <Link
                to={"/"}
                onClick={() => dispatch(Close())}
                className="hover:text-blue-600 cursor-pointer"
              >
                Home
              </Link>
            </li>
            <li
              onClick={() => dispatch(Close())}
              className="hover:text-blue-600 cursor-pointer"
            >
              Features
            </li>
            <li
              onClick={() => dispatch(Close())}
              className="hover:text-blue-600 cursor-pointer"
            >
              How It Works
            </li>
            <li>
              <Link
                to={"about"}
                onClick={() => dispatch(Close())}
                className="hover:text-blue-600 cursor-pointer"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to={"about"}
                onClick={() => dispatch(Close())}
                className="hover:text-blue-600 cursor-pointer"
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="space-x-4 ">
            <Link
              onClick={() => dispatch(Close())}
              to={"/login"}
              className="px-4 py-2 text-white border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              onClick={() => dispatch(Close())}
              to={"/sign-up"}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* small screens */}
    </Ul>
  );
};

export default RightNav;
