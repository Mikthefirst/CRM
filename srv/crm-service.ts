const crmService = async (srv: any) => {
  const { Customers, Feedback } = srv.entities;

  srv.on("setVIPStatus", async (req: any) => {
    const { ID } = req.params[0]; // Customer ID
    const { isVIP } = req.data;

    if (typeof isVIP !== "boolean") {
      return req.reject(400, "isVIP must be a boolean");
    }

    await UPDATE(Customers).set({ isVIP }).where({ ID });

    return { message: `VIP status updated to ${isVIP}` };
  });

  srv.before("CREATE", "Feedback", (req: any) => {
    if (req.data.rating < 3 && req.data.type !== "Complaint") {
      req.warn("Low rating detected. Consider marking type as Complaint.");
    }
  });

};

export = crmService;
