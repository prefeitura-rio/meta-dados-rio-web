const convertUrlToInternal = (url) => {
  // Converts an external URL to an internal URL
  //
  // External URLs are of the form:
  // - https://api.meta.dados.rio/api/<path>
  //
  // Internal URLs are of the form:
  // - /api/meta/<path>
  //
  // Parameters
  // ----------
  // url : string
  //     The external URL to be converted
  //
  // Returns
  // -------
  // string
  //     The internal URL
  //
  // Examples
  // --------
  // >>> convertUrlToInternal("https://api.meta.dados.rio/api/projects/")
  // "/api/meta/projects/"

  return url.replace("https://api.meta.dados.rio/api/", "/api/meta/");
};

export default convertUrlToInternal;
