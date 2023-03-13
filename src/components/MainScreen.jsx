import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";

import { BsGoogle } from "react-icons/bs";
import { GrMail } from "react-icons/gr";
import { AiFillFacebook } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const MainScreen = () => {
  const navigate = useNavigate();

  // Google Sign In
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      user && navigate("/chatbox");
      user && toast.success("Signed in with Google successfully.");
    });
  };

  //Facebook Sign In
  const facebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    // provider.addScope('user_birthday')
    await signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        console.log(result);
        user && navigate("/chatbox");
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        const credential = FacebookAuthProvider.credentialFromError(err);
        console.log(errorCode);
        toast.error(errorCode.split("/")[1]);
      });
  };

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url("https://www.gifcen.com/wp-content/uploads/2022/04/wallpaper-gif-4.gif")`,
      }}
    >
      <div className="hero-overlay bg-opacity-60 "></div>
      <div className="hero-content text-center text-neutral-content ">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">
            Welcome to Sham's Chat App
          </h1>
          <p className="mb-5">
            Please sign up or choose a sign in method to continue
          </p>

          <div className="flex flex-col items-center justify-center  gap-3 mt-3">
            <img
              src="https://i.pinimg.com/originals/9e/bf/62/9ebf62c8eaeb2144e211a60a9893216a.gif"
              className="opacity-50 hover:opacity-100 hover:scale-105 transition-all ease-in duration-300 max-w-sm rounded-full object-cover w-[250px] h-[250px] shadow-2xl"
            />
            <div className="grid grid-cols-2 gap-3 ">
              <button
                onClick={googleSignIn}
                className="btn  opacity-50 hover:opacity-100 transition-all ease-in "
              >
                <span className="flex gap-5">
                  <BsGoogle className="scale-[150%]" />
                  Sign In With Google
                </span>
              </button>
              <button
                onClick={facebookSignIn}
                className="btn opacity-50 hover:opacity-100 transition-all ease-in "
              >
                <span className="flex  items-center gap-5">
                  <AiFillFacebook className="scale-[250%]" />
                  Sign In With Facebook
                </span>
              </button>
            </div>
            <Link
              to="/register"
              className="btn btn-wide  opacity-50 hover:opacity-100 transition-all ease-in "
            >
              <span className="flex gap-6">
                <GrMail className="scale-[150%]" />
                Sign In With E-Mail
              </span>
            </Link>
            <label className="label">
              <Link
                to="/login"
                href="#"
                className="label-text-alt text-sm link link-hover"
              >
                You already have an account?
              </Link>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
