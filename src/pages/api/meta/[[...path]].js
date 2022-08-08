import cookie from "cookie";
import { API_URL } from "../../../config";

const tags = async (req, res) => {
  const query = req.query;
  const { path } = query;
  const cookies = cookie.parse(req.headers.cookie ?? "");
  const access = cookies.access ?? false;

  let urlPath = path.join("/");
  urlPath = urlPath.endsWith("/") ? urlPath : `${urlPath}/`;

  // Get a clone from `query` object, except for the "path" key.
  let searchParams = { ...query };
  delete searchParams.path;

  try {
    const apiRes = await fetch(
      `${API_URL}/api/${urlPath}?` +
        new URLSearchParams({
          ...searchParams
        }),
      {
        method: req.method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`
        },
        body:
          req.method === "GET" || req.method === "HEAD"
            ? null
            : JSON.stringify(req.body)
      }
    );

    const apiResText = await apiRes.text();

    return res.status(apiRes.status).send(apiResText);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong when fetching the API" });
  }
};

export default tags;
