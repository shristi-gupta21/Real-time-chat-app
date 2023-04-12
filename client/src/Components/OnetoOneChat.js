/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useContext, useEffect, useState, useRef } from "react";
import { context } from "../Context";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Notification from "./Notification";
import "./index.css";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import { NotificationContainer } from "react-notifications";

const OnetoOneChat = () => {
  const { socket } = useContext(context);
  const [user, setuser] = useState([]);
  const [room, setroom] = useState();
  const [dis, setdis] = useState(false);
  const [name, setname] = useState([]);
  const [arr, setarr] = useState([]);
  const [click, setClick] = useState(false);
  const [userClick, setuserClick] = useState(false);
  const [msg, setmsg] = useState("");
  const [displaymsg, setdisplaymsg] = useState([]);
  const [socketid, setsocketid] = useState();
  const [socketidname, setsocketidname] = useState();
  const [file, setFile] = useState();
  const messagesEndRef = useRef(null);
  let count = 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displaymsg]);

  const onSubmit = () => {
    socket.emit("join_room", {
      room: room,
      name: name,
    });
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
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      console.log("working...");
      // showNotification();
    }
  }, [displaymsg]);

  useEffect(() => {
    socket.on("recieve_msg", (data) => {
      setdisplaymsg((prev) => [...prev, data]);
    });
  }, [socket]);
  console.log("displaymsg", displaymsg);

  const onTypeMsg = (e) => {
    setmsg(e.target.value);
  };
  const onSendMsg = async (e) => {
    console.log("file====", file);
    const messageObject = {
      name,
      message: msg,
      socketid,
      socketidmsgtouser: arr.filter((item) => name === item.name && item.id)[0]
        .id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      file: file,
    };
    await socket.emit("send_msg", messageObject);
    setdisplaymsg((prev) => [...prev, messageObject]);
    setmsg("");
    // showNotification();
  };

  const onClickName = (name, id) => {
    setsocketidname(name);
    setsocketid(id);
    setuserClick(true);
  };

  const onFileChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    setFile(url);
    console.log("url====", url);
  };
  console.log(displaymsg);
  const downloadTxtFile = (string) => {
    console.log(string);
    let alink = document.createElement("a");
    alink.href = string;
    alink.download = "SamplePDF.pdf";
    alink.click();
  };

  const calcLength = (arr) => {
    console.log("arr", arr);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]?.room === room) {
        count++;
      } else {
        count = 0;
      }
    }
    return count - 1;
  };

  const showNotification = () => {
    // window.Notification.requestPermission();
    new window.Notification("Hello World");
  };
  return (
    <>
      {" "}
      {dis ? (
        <div>
          <header className="flexRow">
            <h1>Welcome to the room {room}</h1>
            <span className="username flexMinRow">{name}</span>
          </header>
          <div className="flexRow mainCntnr">
            <div className="flexCol users">
              <h2>
                Users Joined:
                {arr.length !== 0 && calcLength(arr)}
              </h2>
              <span>Participants Name:</span>

              {arr.map((item) => (
                <>
                  {item.room === room ? (
                    name === item.name ? (
                      ""
                    ) : (
                      <p
                        className="usernames"
                        onClick={() => onClickName(item.name, item.id)}
                      >
                        {item.name}
                      </p>
                    )
                  ) : (
                    ""
                  )}
                </>
              ))}
            </div>

            <div className="flexCol chatBox">
              {userClick && (
                <div>
                  <div className="box ">
                    <span className="flexMinRow">{socketidname}</span>

                    <div>
                      {displaymsg.map((item) => (
                        <>
                          {item.socketidmsgtouser === socketid ||
                          item.socketid === socketid ? (
                            item.socketid === socketid ? (
                              item.message !== "" || item.file !== undefined ? (
                                <div className="container">
                                  <div className="msgBox msgBox1">
                                    {item.message}
                                    <div className="time">{item.time}</div>
                                    <div ref={messagesEndRef}></div>
                                    {item.file !== undefined ? (
                                      <iframe src={item.file} title="file" />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )
                            ) : item.message !== "" ||
                              item.file !== undefined ? (
                              <div className="container">
                                <div className="msgBox msgBox2">
                                  {item.message}
                                  <div className="time">{item.time}</div>

                                  <div ref={messagesEndRef}></div>
                                  <div>
                                    {item.file !== undefined ? (
                                      <>
                                        <iframe
                                          src={item.file}
                                          title="dbhcjn"
                                        />
                                        <DownloadIcon
                                          onClick={() =>
                                            downloadTxtFile(item.file)
                                          }
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                  <div className="inputarea">
                    <input
                      className="txtArea"
                      type="text"
                      value={msg}
                      onChange={onTypeMsg}
                      contentEditable={true}
                    />
                    <label className="label" htmlFor="fileInput">
                      <AttachFileIcon />
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      className="attachFile"
                      onChange={onFileChange}
                    />
                    <Button
                      variant="contained"
                      onClick={onSendMsg}
                      className="sendBtn"
                      size="large"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flexCol notification">
              <Notification />
              <div>
                {" "}
                {displaymsg.map((item) => (
                  <>
                    {item.socketidmsgtouser === socketid ? (
                      <NotificationContainer />
                    ) : (
                      ""
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="joinRoomBox flexRow">
            <div className="joinRoom flexMinCol">
              <h2>Join the room</h2>
              <br />
              <label>Name: </label>

              <input type="text" onChange={(e) => setname(e.target.value)} />
              <br />
              <br />

              <label> Room id: </label>
              <input type="number" onChange={(e) => setroom(e.target.value)} />
              <br />
              <br />
              {click ? (
                <OnetoOneChat />
              ) : (
                <button onClick={onSubmit}>Submit</button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OnetoOneChat;
