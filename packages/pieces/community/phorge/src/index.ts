
import { createPiece } from "@activepieces/pieces-framework";
import { phorgeAuth } from "./lib/common/auth";
import { newTask } from "./lib/triggers/new-task";
import { updatedTask } from "./lib/triggers/updated-task";
import { createTask } from "./lib/actions/create-task";

export const phorge = createPiece({
  displayName: "Phorge",
  auth: phorgeAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://we.phorge.it/file/data/f53fnxucyclus3wp6gac/PHID-FILE-3z4hzrrgqjytd7ueokle/Phorge_logo_white_56.png",
  authors: [],
  actions: [createTask],
  triggers: [newTask, updatedTask],
});
