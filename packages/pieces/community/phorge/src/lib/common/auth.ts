import { PieceAuth, Property } from "@activepieces/pieces-framework";

export const phorgeAuth = PieceAuth.CustomAuth({
  props: {
    hostname: Property.ShortText({
      displayName: 'Phorge Hostname',
      description: 'The hostname of your Phorge instance (e.g., phorge.example.com)',
      required: true,
    }),
    apiKey: PieceAuth.SecretText({
      displayName: 'API Key',
      description: 'Your Phorge API Key',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      return { valid: true };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid Hostname or API Key',
      };
    }
  },
  required: true,
});