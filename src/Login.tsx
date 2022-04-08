import styled from "styled-components";
import { loginWithGoogle } from "./firebase";

export default function Login() {
  return (
    <Center>
      <h1>pixel app</h1>
      <LoginButton onClick={loginWithGoogle}>Log In With Google</LoginButton>
    </Center>
  );
}

const LoginButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #242422;
  height: 100%;
  width: 100%;
`;
