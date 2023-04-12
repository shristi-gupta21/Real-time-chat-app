import React from "react";
import { useState, useContext, useEffect } from "react";
import { context } from "../Context";
import NotificationsActiveSharpIcon from "@mui/icons-material/NotificationsActiveSharp";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { NotificationManager } from "react-notifications";

const Notification = () => {
  const { socket } = useContext(context);
  const [click, setclick] = useState(false);
  const [msgs, setmsgs] = useState([]);
  const [length, setlength] = useState(0);

  const clickbtn = () => {
    setclick(!click);
    setlength(msgs.length);
  };

  useEffect(() => {
    socket.on("notification", (data) => {
      setmsgs((prev) => [
        ...prev,
        { name: data?.name, message: data?.message },
      ]);

      NotificationManager.info(
        data?.message,
        data?.name + " messaged you!",
        5000
      );
    });
  }, [socket]);

  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          fontSize: "large",
          right: "250px",
          position: "absolute",
        }}
      >
        {msgs.length - length > 0 && !click && (
          <div
            style={{
              height: "10px",
              width: "10px",
              borderRadius: "50%",
              backgroundColor: "red",
              textAlign: "center",
              fontSize: "10px",
              color: "white",
              position: "absolute",
              left: "13px",
              paddingTop: "1px",
            }}
          ></div>
        )}
        {/* A material ui icon. */}
        <NotificationsActiveSharpIcon
          onClick={clickbtn}
          style={{ cursor: "pointer" }}
        />

        {click &&
          (msgs.length !== 0 ? (
            <div
              style={{
                height: "fit-content",
                width: "250px",
                position: "absolute ",
                backgroundColor: "white",
                border: "1px solid",
                padding: "5px",
              }}
            >
              {msgs.map((item) => (
                <>
                  <div>
                    <TripOriginIcon
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    />

                    <span style={{ color: "gray", fontSize: "15px" }}>
                      {" "}
                      {item.name}{" "}
                    </span>
                    <span style={{ fontSize: "15px" }}>just messaged you </span>
                    <span style={{ fontSize: "15px" }}>
                      <b>{item.message}</b>
                    </span>
                  </div>
                </>
              ))}
            </div>
          ) : (
            <p style={{ position: "absolute ", width: "200px" }}>
              no notifications
            </p>
          ))}
      </span>
    </div>
  );
};

export default Notification;
