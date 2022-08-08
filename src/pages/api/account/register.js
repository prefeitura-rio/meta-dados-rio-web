import { API_URL } from "../../../config";

const register = async (req, res) => {
  if (req.method === "POST") {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      re_password,
      registration_token
    } = req.body;

    const body = JSON.stringify({
      first_name,
      last_name,
      username,
      email,
      password,
      re_password,
      registration_token
    });

    try {
      const apiRes = await fetch(`${API_URL}/api/account/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: body
      });

      const data = await apiRes.json();

      if (apiRes.status === 201) {
        return res.status(201).json({ success: data.success });
      }

      return res.status(apiRes.status).json({ error: data.error });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Something went wrong when registering" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
};

export default register;
