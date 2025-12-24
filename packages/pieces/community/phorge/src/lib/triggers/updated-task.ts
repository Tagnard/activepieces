
import { createTrigger, TriggerStrategy, AppConnectionValueForAuthProperty } from '@activepieces/pieces-framework';
import { DedupeStrategy, Polling, pollingHelper } from '@activepieces/pieces-common';
import { phorgeAuth } from '../common/auth';
import { PhorgeClient } from '../common/client';

// replace auth with piece auth variable
const polling: Polling<AppConnectionValueForAuthProperty<typeof phorgeAuth>, Record<string, never>> = {
    strategy: DedupeStrategy.TIMEBASED,
    items: async ({ propsValue, lastFetchEpochMS, auth }) => {
        const client = new PhorgeClient(auth.props.hostname, auth.props.apiKey)
        const lastFetchEpochS = lastFetchEpochMS == 0 ? 1 : Math.floor(lastFetchEpochMS / 1000)
        let tasks = await client.searchTask({
            constraints: {
                modifiedStart: lastFetchEpochS
            }
        })

        return tasks.filter(task => task.fields.dateModified > lastFetchEpochS)
            .map(task => ({
                epochMilliSeconds: task.fields.dateModified * 1000,
                data: task
            }))
    }
}

export const updatedTask = createTrigger({
    // auth: check https://www.activepieces.com/docs/developers/piece-reference/authentication,
    name: 'updatedTask',
    displayName: 'Updated Task',
    description: 'Triggers when an existing task is updated.',
    auth: phorgeAuth,
    props: {},
    sampleData: {},
    type: TriggerStrategy.POLLING,
    async test(context) {
        return await pollingHelper.test(polling, context);
    },
    async onEnable(context) {
        const { store, auth, propsValue } = context;
        await pollingHelper.onEnable(polling, { store, auth, propsValue });
    },

    async onDisable(context) {
        const { store, auth, propsValue } = context;
        await pollingHelper.onDisable(polling, { store, auth, propsValue });
    },

    async run(context) {
        return await pollingHelper.poll(polling, context);
    },
});