import React from "react";
import styled from "styled-components";
import { Position } from "./types";

export default function Cursor({ position, name }: { position: Position, name: string }) {
  return (
    <CursorContainer style={{ top: position.y, left: position.x }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        id="Capa_1"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        width="16"
        height="16"
      >
        <g id="_x3C_Group_x3E__20_">
          <g>
            <path d="M90.998,512c-1.934,0-3.882-0.366-5.742-1.143c-5.61-2.314-9.258-7.793-9.258-13.857V15    c0-6.064,3.647-11.543,9.258-13.857c5.625-2.329,12.056-1.025,16.348,3.252l330,331c4.292,4.292,5.581,10.737,3.252,16.348    c-2.314,5.61-7.793,9.258-13.857,9.258H247.209L101.604,507.606C98.733,510.477,94.895,512,90.998,512z" />
          </g>
        </g>
      </svg>
      {name}
    </CursorContainer>
  );
}

const CursorContainer = styled.div`
  position: fixed;
  z-index: 1000;
`;
