import { nanoid } from "nanoid";
import React from "react";
import styled from "styled-components";
import AddArtboard from "./AddArdboard";
import ColorPalette from "./ColorPalette";
import {
  deleteArtboard,
  logout,
  saveArtboard,
  useArtboards,
  useAuthUser,
} from "./firebase";
import { Tool, useCurrentArboard, useCurrentTool, useScale } from "./state";

export default function Menu() {
  const [, setCurrentTool] = useCurrentTool();
  const [scale, setScale] = useScale();
  const [currentArtboard] = useCurrentArboard();
  const { user } = useAuthUser();

  if (!user) return null;

  return (
    <Tools>
      <AddArtboard add={addArtBoard} />
      <ToolEntry>
        scale{" "}
        <Input
          type="number"
          value={scale}
          onChange={(e) =>
            setScale(Number((e.target as HTMLInputElement).value))
          }
        />
      </ToolEntry>
      <ColorPalette />
      <button onClick={() => setCurrentTool(Tool.Pencil)}>pencil</button>
      <button onClick={() => setCurrentTool(Tool.Rectangle)}>
        rectangle fill
      </button>
      <button onClick={() => setCurrentTool(Tool.RectangleOutline)}>
        rectangle outline
      </button>
      {currentArtboard && <CurrentArtboard />}
      <Grower />
      <UserInfo>
        <UserPicture width={50} height={50} src={user.photoURL} alt="user" />
        <div>
          Logged in as
          <br />
          <strong>{user.displayName}</strong>
        </div>
      </UserInfo>
      <button onClick={logout}>Log Out</button>
    </Tools>
  );
}

function CurrentArtboard() {
  const [currentArtboardId, setCurentArtboard] = useCurrentArboard();
  const artboards = useArtboards();
  const artboard = artboards?.[currentArtboardId];

  return (
    <div>
      <h3>{artboard?.name}</h3>
      <button onClick={onDelete}>delete board</button>
    </div>
  );

  function onDelete() {
    deleteArtboard(artboard.id);
    setCurentArtboard(null);
  }
}

function addArtBoard(width: number, height: number) {
  saveArtboard({
    id: nanoid(),
    name: "artboard",
    width,
    height,
    position: {
      x: 0,
      y: 0,
    },
  });
}

const Tools = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 250px;
  background-color: white;
  box-sizing: border-box;
  height: 100%;
`;

const Input = styled.input`
  width: 50px;
`;

const ToolEntry = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const Grower = styled.div`
  display: flex;
  flex: 1;
`;

const UserPicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 5px;
`;

const UserInfo = styled.section`
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
`;
