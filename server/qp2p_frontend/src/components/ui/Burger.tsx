import React, {  useState } from "react";
import styled from "styled-components";
import RightNav from "./RightNav";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/States/store";
import { Close, Open } from "@/States/thunks/verifySendersWallet";

// StyledBurger component with type annotations for props

const StyledBurger = styled.div<{ open: boolean }>`
  width: 2rem;
  height: 2rem;
  position: sticky;
  top: 1rem;
  right: 1.3rem;
  z-index: 20;
  display: none;

  @media (max-width: 425px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background-color: ${({ open }) => (open ? "red" : "#0a1334")};
    border-radius: 0.7rem;
    transform-origin: 1px;
    transition: all 0.3s linear;

    &:nth-child(1) {
      transform: ${({ open }) => (open ? "rotate(45deg)" : "rotate(0)")};
    }
    &:nth-child(2) {
      transform: ${({ open }) => (open ? "translateX(100%)" : "translateX(0)")};
      opacity: ${({ open }) => (open ? "0" : "1")};
    }
    &:nth-child(3) {
      transform: ${({ open }) => (open ? "rotate(-45deg)" : "rotate(0)")};
    }
  }
`;

// Burger component
const Burger: React.FC = () => {
  //   const { open, setOpen } = useContext(AppContext);
  const [openBurger, setopen] = useState(false);
  const { burger } = useSelector((state: RootState) => state.verifyWallet);
  const dispatch: AppDispatch = useDispatch();

  //   if (typeof setOpen !== "function") {
  //     throw new Error("AppContext: setOpen is not a function");
  //   }

  const handleChange = () => {
    if (openBurger) {
      dispatch(Open());
    } else {
      dispatch(Close());
    }
  };
 
  return (
    <>
      <StyledBurger open={burger} onClick={() => {setopen(!openBurger),handleChange()}}>
        <div />
        <div />
        <div />
      </StyledBurger>
      <RightNav />
    </>
  );
};

export default Burger;
