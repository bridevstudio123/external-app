import { NextFunction, Request, Response } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.headers["x-forwarded-email"] as string;

    console.log("email", email);
    // res.status(200).json({
    //   status: "success",
    // });
    next()
  } catch (error: any) {
    res.status(403).json({ status: "error", message: error?.message });
  }
};

export default auth
