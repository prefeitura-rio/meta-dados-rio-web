import cookie from "cookie";
import { API_URL, SECURE_COOKIES } from "../../../config";

const refresh = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed`
    });
  }

  const cookies = cookie.parse(req.headers.cookie ?? "");
  const refresh = cookies.refresh ?? false;

  if (refresh === false) {
    return res.status(401).json({
      error: "You are not authorized to make this request"
    });
  }

  const body = JSON.stringify({
    refresh
  });

  try {
    const apiRes = await fetch(`${API_URL}/api/token/refresh/`, {
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
        success: "Refresh successful"
      });
    } else {
      return res.status(apiRes.status).json({
        error: "Refresh failed"
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong when trying to refresh"
    });
  }
};

export default refresh;
