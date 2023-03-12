import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { setDoc, serverTimestamp, doc } from "firebase/firestore";
import { CiMail } from "react-icons/ci";
import { FiLogIn } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import { AiFillFileImage } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
const Register = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    file: null,
  });

  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fileInput: "",
    signInError: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validate(e);
  };

  const validate = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "username":
          if (!value) {
            stateObj[name] = "Please enter an username";
          }
          break;
        case "email":
          if (!value) {
            stateObj[name] = "Please enter an email";
          }
          break;
        case "password":
          if (!value) {
            stateObj[name] = "Please enter a password.";
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] = "Passwords do not match.";
          } else {
            stateObj["confirmPassword"] = input.confirmPassword
              ? ""
              : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter confirm password";
          } else if (input.password && value != input.password) {
            stateObj[name] = "Passwords do not match.";
          }
          break;
        default:
          break;
      }

      return stateObj;
    });
  };

  const handleDatabase = async (user, file) => {
    const date = new Date().getTime();
    const storageRef = ref(storage, `${input.username + date}`);

    await uploadBytesResumable(storageRef, file).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        try {
          await setDoc(doc(db, "users", input.username), {
            uid: user.uid,
            displayName: input.username,
            email: user.email,
            photoURL: downloadURL,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          console.log("Database'e basarken bişi oldu kanka");
          toast.error(err.code);
        }
        try {
          await updateProfile(user, {
            displayName: input.username,
            photoURL: downloadURL,
          });
        } catch (err) {
          console.log("Profile updatelerken sıçtı galiba");
          toast.error(err.code);
        }
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, input.email, input.password)
      .then((userCredentials) => {
        const user = userCredentials.user;

        handleDatabase(user, input.file);
        user &&
          setError({
            email: "",
            confirmPassword: "",
            password: "",
            submitError: "",
            username: "",
            file: "",
          });
        setInput({
          email: "",
          password: "",
          confirmPassword: "",
          username: "",
          file: null,
        });
        user && navigate("/chatbox");
        user && toast.success("Account created successfully!");
      })
      .catch((err) => {
        setError({ ...error, signInError: err.code });
        toast.error(err.code);
      });
    //
  };

  return (
    <div className="hero flex justify-center  min-h-screen bg-[url('https://www.gifcen.com/wp-content/uploads/2022/04/wallpaper-gif-4.gif')]">
      <form
        className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 bg-opacity-80"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex gap-1 ">
                <RxAvatar className="scale-150 pt-1" />
                Username
              </span>
            </label>
            <input
              name="username"
              value={input.username}
              onChange={handleChange}
              onBlur={validate}
              type="text"
              placeholder="username"
              pattern="^[A-Za-z][A-Za-z0-9_]{7,29}$"
              className="input input-bordered"
              required
            />
            {error.username && (
              <div className="alert alert-error shadow-lg my-3 p-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error.username}</span>
                </div>
              </div>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex gap-1 ">
                <CiMail className="scale-150 pt-1" />
                Email
              </span>
            </label>
            <input
              name="email"
              value={input.email}
              onChange={handleChange}
              onBlur={validate}
              type="email"
              placeholder="E-mail"
              pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
              className="input input-bordered"
              required
            />
            {error.email && (
              <div className="alert alert-error shadow-lg my-3 p-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error.email}</span>
                </div>
              </div>
            )}
          </div>
          <div className="form-control ">
            <label className="label">
              <span className="label-text flex gap-1 ">
                <RiLockPasswordFill className="scale-150 pt-1" />
                Password
              </span>
            </label>
            <input
              name="password"
              value={input.password}
              onBlur={validate}
              onChange={handleChange}
              type="password"
              placeholder="password"
              errormessage="Password should be at least 8 characters, must contain at least 1 uppercase 1 lowercase letter and a number.(Can contain special characters)"
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
              className="input input-bordered"
              required
            />
            {error.password && (
              <div className="alert alert-error shadow-xl my-3 p-2  transition-all">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error.password}</span>
                </div>
              </div>
            )}
          </div>
          <div className="form-control ">
            <label className="label">
              <span className="label-text flex gap-1 ">
                <RiLockPasswordFill className="scale-150 pt-1" />
                Confirm Password
              </span>
            </label>
            <input
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={handleChange}
              onBlur={validate}
              type="password"
              placeholder="confirm password"
              pattern={input.password}
              className="input input-bordered"
              required
            />
            {error.confirmPassword && (
              <div className="alert alert-error shadow-lg my-3 p-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error.confirmPassword}</span>
                </div>
              </div>
            )}
          </div>
          <div className="form-control ">
            <label className="label">
              <span className="label-text flex gap-1 ">
                <AiFillFileImage className="scale-150 pt-1" />
                Avatar
              </span>
            </label>

            <input
              onChange={(e) => {
                setInput({ ...input, file: e.target.files[0] });
              }}
              required
              type="file"
              className="file-input w-full max-w-xs"
            />
          </div>
          <label className="label">
            <Link to="/login" className="label-text-alt link link-hover">
              Do you have an account already ?
            </Link>
          </label>
        </div>

        <div className="form-control m-6">
          <button
            type="submit"
            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$"
            onClick={() => setInput({ ...input, [input.name]: "" })}
            className="btn btn-primary"
          >
            <FiLogIn className="mr-2 scale-150" />
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
