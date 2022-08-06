import cookie from "cookie";
import { API_URL, SECURE_COOKIES } from "../../../config";

const login = async (req, res) => {
  if (req.method === "POST") {
    const { username, password } = req.body;

    const body = JSON.stringify({ username, password });

    try {
      const apiRes = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body
      });

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        res.setHeader("Set-Cookie", [
          cookie.serialize("access", data.access, {
            httpOnly: true,
            secure: SECURE_COOKIES,
            maxAge: 60 * 30, // 30 minutes
            sameSite: "strict",
            path: "/api/"
          }),
          cookie.serialize("refresh", data.refresh, {
            httpOnly: true,
            secure: SECURE_COOKIES,
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: "strict",
            path: "/api/"
          })
        ]);

        return res.status(200).json({
          success: "Logged in successfully"
        });
      } else {
        return res.status(apiRes.status).json({
          error: "Authentication failed"
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: "Something went wrong when authenticating"
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default login;
