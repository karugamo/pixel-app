import styled from "styled-components";

const Button = styled.button<{selected?: boolean}>`
  background-color: ${({selected}) => selected ? '#7676b0' : '#353540'} ;
  color: #fdfbfb;
  border: none;
  padding: 4px 8px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
`;

export default Button;
