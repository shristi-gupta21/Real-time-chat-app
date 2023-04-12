import React from "react";
import { useContext, useEffect, useState } from "react";
import { context } from "../Context";
import OnetoOneChat from "./OnetoOneChat";
const Component = () => {
  const { socket } = useContext(context);
  const [user, setuser] = useState([]);
  const [room, setroom] = useState();
  const [dis, setdis] = useState(false);
  const [name, setname] = useState([]);
  const [arr, setarr] = useState([]);
  const [arr2, setarr2] = useState([]);
  const [click, setClick] = useState(false);
  const onSubmit = () => {
    socket.emit("join_room", { room, name });
    setdis(true);
    setClick(true);
    setuser((prev) => [...prev, name]);
    socket.emit("users", [...user, name]);
  };
  useEffect(() => {
    socket.on("usersinfo", (data) => {
      setuser((prev) => [...prev, data]);
    });
  }, [socket]);
  useEffect(() => {
    socket.on("send_data", (data) => {
      setarr(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("online", (data) => {
      setarr2(data);
    });
  }, [socket]);
  // console.log(arr2);
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {dis ? (
        <>
          <p
            style={{
              textAlign: "center",
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "25px",
              fontFamily: "monospace",
            }}
          >
            Welcome to the Room {room}
          </p>
          <div
            style={{
              display: "flex",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", left: "23rem" }}>
              <h3 style={{ textTransform: "uppercase" }}>Connected</h3>
              <p>Users: {arr.length}</p>
              {arr.map((item) => (
                <>
                  <p>{item.name}</p>
                </>
              ))}
            </div>
            <div style={{ position: "absolute", right: "25rem" }}>
              <h3 style={{ textTransform: "uppercase" }}>Disconnected</h3>
              <p>Users: {arr2.length}</p>
              {arr2.map((item) => (
                <>
                  <p>{item}</p>
                </>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <label>Name:</label>
          <input type="text" onChange={(e) => setname(e.target.value)} />
          <br />
          <br />
          Room id:
          <input type="number" onChange={(e) => setroom(e.target.value)} />
          <br />
          <br />
          {click ? (
            <OnetoOneChat />
          ) : (
            <button style={{ display: "block" }} onClick={onSubmit}>
              Submit
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Component;
