import cookie from "cookie";
import { SECURE_COOKIES } from "../../../config";

const logout = async (req, res) => {
  if (req.method === "POST") {
    res.setHeader("Set-Cookie", [
      cookie.serialize("access", "", {
        httpOnly: true,
        secure: SECURE_COOKIES,
        expires: new Date(0),
        sameSite: "strict",
        path: "/api/"
      }),
      cookie.serialize("refresh", "", {
        httpOnly: true,
        secure: SECURE_COOKIES,
        expires: new Date(0),
        sameSite: "strict",
        path: "/api/"
      })
    ]);

    return res.status(200).json({
      success: "Successfully logged out"
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`
    });
  }
};

export default logout;
