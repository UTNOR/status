export default {
  async fetch(request, env, ctx) {
  try {
    
    let param = req.query?.status;
    let statusCode = Number(param);

    if (isNaN(statusCode)) {
      throw new Error("Invalid status code provided");
    }

    return res.status(statusCode);

  } catch (err) {
    return new Responce(status(500).json({
      error: "Server Error",
      details: err.message
      received: param,
      message: "Error",
      docs: "https://doc.utnor.com/tools/status"
    });
  )}
}
