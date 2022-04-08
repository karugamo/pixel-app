import React, { useEffect } from "react";
import Cursor from "./Cursor";
import { setCursor, useAuthUser, useCursors } from "./firebase";

export default function Cursors() {
  const cursors = useCursors();
  const { user } = useAuthUser();

  useEffect(() => {
    if (!user) return;

    window.addEventListener("mousemove", (e) => {
      setCursor({ x: e.pageX, y: e.pageY }, user);
    });
  }, [user]);

  return (
    <>
      {Object.entries(cursors)
        .filter(([key, { id, lastSeen}]) => id !== user?.uid && Date.now() - lastSeen < 5000)
        .map(([key, position]) => (
          <Cursor key={key} position={position} name={position.name} />
        ))}
    </>
  );
}
