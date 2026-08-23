import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

type AsyncController<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction
) => Promise<unknown>;

export const asyncHandler = <
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  controller: AsyncController<P, ResBody, ReqBody, ReqQuery>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
};