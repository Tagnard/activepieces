
    import { createPiece, PieceAuth } from "@activepieces/pieces-framework";

    export const phorge = createPiece({
      displayName: "Phorge",
      auth: PieceAuth.None(),
      minimumSupportedRelease: '0.36.1',
      logoUrl: "https://cdn.activepieces.com/pieces/phorge.png",
      authors: [],
      actions: [],
      triggers: [],
    });
    