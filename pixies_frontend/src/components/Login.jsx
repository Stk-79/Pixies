import React from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
} from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          className="w-full h-full object-cover"
          loop
          controls={false}
          muted
          autoPlay
        >
          <source
            src={require("../assets/share.mp4")}
            type="video/mp4"
          ></source>
        </video>
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo"></img>
          </div>

          <div className="shadow-2xl">
            <GoogleOAuthProvider
              clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
            >
              <div>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const decoded = jwt_decode(credentialResponse.credential);
                    const { name, picture, sub } = decoded;

                    const USER = {
                      name: name,
                      picture: picture,
                      sub: sub,
                    };
                    localStorage.setItem("user", JSON.stringify(USER));

                    //In Old GoogleAUTH -> response gives profileObj:{googleId,name,imageUrl}
                    const doc = {
                      _id: sub, //googleId
                      _type: "user",
                      userName: name,
                      image: picture, //imageUrl
                    };

                    client.createIfNotExists(doc).then(() => {
                      navigate("/");
                    });
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
