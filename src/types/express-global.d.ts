type TypedResponse =
  | {
      data: Record<string, any>;
    }
  | {
      error: {
        code: number | string;
        message: string;
        data?: Record<string, any>;
      };
    };
export type ExpressTypedResponse = Response<TypedResponse>;
export {};
declare module "express-serve-static-core" {
  //request handler
  export interface RequestHandler<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = unknown
  > {
    (
      req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
      res: Response<TypedResponse, LocalsObj>,
      next: NextFunction
    ): any;
  }
}
