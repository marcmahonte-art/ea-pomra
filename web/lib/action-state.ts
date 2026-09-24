export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string; reportId?: string }
  | { status: "error"; message: string };

export const idleActionState: ActionState = { status: "idle" };

export function actionError(message: string): ActionState {
  return { status: "error", message };
}

export function actionSuccess(message: string, reportId?: string): ActionState {
  return reportId ? { status: "success", message, reportId } : { status: "success", message };
}
