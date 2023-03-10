import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
  
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [loginCredential, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      loginCredential.email.trim() === "" &&
      loginCredential.password.trim() === ""
    ) {
      console.error("Please enter a valid mail or password");
    }
    signInWithEmailAndPassword(
      auth,
      loginCredential.email,
      loginCredential.password
    )
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
        toast.success("Signed in with E-mail successfully");
        navigate("/chatbox");
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        toast.error(errorCode);
      });

    setLoginCredentials({ email: "", password: "" });
  };

  return (
    <div className="hero min-h-screen bg-[url('https://www.gifcen.com/wp-content/uploads/2022/04/wallpaper-gif-4.gif')]">
      <form
        onSubmit={handleSubmit}
        className="card w-[25rem] flex-shrink-0 shadow-2xl bg-base-100 bg-opacity-80"
      >
        <h1 className="hero-content text-5xl pt-4">Login</h1>
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex gap-1 ">
                <CiMail className="scale-150 pt-1" />
                Email
              </span>
            </label>
            <input
              value={loginCredential.email}
              onChange={(e) =>
                setLoginCredentials({
                  ...loginCredential,
                  email: e.target.value,
                })
              }
              type="email"
              placeholder="email"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex gap-1 scale-">
                <RiLockPasswordFill className="scale-150 pt-1" />
                Password
              </span>
            </label>
            <input
              value={loginCredential.password}
              onChange={(e) =>
                setLoginCredentials({
                  ...loginCredential,
                  password: e.target.value,
                })
              }
              type="password"
              placeholder="password"
              className="input input-bordered"
              required
            />
            <label htmlFor="" className="label">
              <Link to="/register" className="label-text-alt link link-hover">
                Don't you have an account yet ?
              </Link>
            </label>
          </div>
          <div className="form-control mt-6">
            {user && (
              <button className="btn btn-warning" onClick={signOut(auth)}>
                Log Out
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
