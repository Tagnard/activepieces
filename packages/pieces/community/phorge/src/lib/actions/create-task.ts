import { createAction, Property } from '@activepieces/pieces-framework';
import { phorgeAuth } from '../common/auth';
import { PhorgeClient } from '../common/client';

export const createTask = createAction({
  // auth: check https://www.activepieces.com/docs/developers/piece-reference/authentication,
  name: 'createTask',
  displayName: 'Create Task',
  description: 'Create a new maniphest task',
  auth: phorgeAuth,
  props: {
    title: Property.ShortText({
      displayName: "Title",
      required: false
    }),
    description: Property.ShortText({
      displayName: "Description",
      description: "The contents of the task",
      required: false
    })
  },
  async run(context) {
    let client = new PhorgeClient(context.auth.props.hostname, context.auth.props.apiKey)
  },
});
