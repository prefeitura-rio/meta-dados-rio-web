import { API_URL } from "../../../config";
import cookie from "cookie";

const verify = async (req, res) => {
  if (req.method === "GET") {
    const cookies = cookie.parse(req.headers.cookie ?? "");
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(403).json({
        error: "You are not authorized to make this request"
      });
    }

    const body = JSON.stringify({
      token: access
    });

    try {
      const apiRes = await fetch(`${API_URL}/api/token/verify/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body
      });

      if (apiRes.status === 200) {
        return res.status(200).json({
          success: "Authenticated successfully"
        });
      } else {
        return res.status(apiRes.status).json({
          error: "Authentication failed"
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Something went wrong when trying to authenticate"
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed`
    });
  }
};

export default verify;
