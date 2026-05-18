import type { Request, Response } from "express";
export declare const createBattle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBattles: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const appendBattleMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const renameBattle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteBattle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const judgeBattle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const webSearch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=battle.controller.d.ts.map