import { nanoid } from "nanoid";
import React from "react";
import styled from "styled-components";
import AddArtboard from "./AddArdboard";
import ColorPalette from "./ColorPalette";
import Button from "./components/Button";
import Input from "./components/Input";
import VerticalDivider from "./components/VerticalDivider";
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
      <MainTools>
        <AddArtboard add={addArtBoard} />
      </MainTools>
      <VerticalDivider />
      <MainTools>
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
      </MainTools>
      <VerticalDivider />
      <MainTools>
        <ColorPalette />
      </MainTools>
      <VerticalDivider />
      <MainTools>
        <Button onClick={() => setCurrentTool(Tool.Pencil)}>pencil</Button>
        <Button onClick={() => setCurrentTool(Tool.Rectangle)}>
          rectangle fill
        </Button>
        <Button onClick={() => setCurrentTool(Tool.RectangleOutline)}>
          rectangle outline
        </Button>
      </MainTools>

      {currentArtboard && <CurrentArtboard />}
      <Grower />
      <VerticalDivider />
      <User>
        <UserInfo>
          <UserPicture
            referrerPolicy="no-referrer"
            width={50}
            height={50}
            src={user.photoURL}
            alt="user"
          />
          <div>
            Logged in as
            <br />
            <strong>{user.displayName}</strong>
          </div>
        </UserInfo>
        <Button onClick={logout}>Log Out</Button>
      </User>
    </Tools>
  );
}

function CurrentArtboard() {
  const [currentArtboardId, setCurentArtboard] = useCurrentArboard();
  const artboards = useArtboards();
  const artboard = artboards?.[currentArtboardId];

  return (
    <>
      <VerticalDivider />
      <MainTools>
        <ToolsHeader>{artboard?.name}</ToolsHeader>
        <Button onClick={onDelete}>delete board</Button>
      </MainTools>
    </>
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
  flex-direction: column;
  gap: 16px;
  width: 250px;
  background-color: white;
  box-sizing: border-box;
  height: 100%;
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

const User = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
  gap: 16px;
`;

const UserInfo = styled.section`
  display: flex;
  gap: 16px;
  width: 100%;
  align-items: center;
`;

const MainTools = styled.section`
  display: flex;
  flex-direction: column;
  margin: 16px;
  gap: 16px;
`;

const ToolsHeader = styled.h3`
  margin-bottom: 0;
  margin-top: 0;
`;
