
import { createTrigger, TriggerStrategy, AppConnectionValueForAuthProperty, Property, StaticPropsValue, ShortTextProperty } from '@activepieces/pieces-framework';
import { DedupeStrategy, Polling, pollingHelper } from '@activepieces/pieces-common';
import { phorgeAuth } from '../common/auth';
import { PhorgeClient } from '../common/client';

// replace auth with piece auth variable
const polling: Polling<AppConnectionValueForAuthProperty<typeof phorgeAuth>, StaticPropsValue<{ status: ShortTextProperty<false>; }>> = {
    strategy: DedupeStrategy.TIMEBASED,
    items: async ({ propsValue, lastFetchEpochMS, auth }) => {
        const client = new PhorgeClient(auth.props.hostname, auth.props.apiKey)
        const lastFetchEpochS = Math.floor(lastFetchEpochMS / 1000)
        let tasks = await client.searchTask({
            constraints: {
                createdStart: lastFetchEpochS
            }
        })

        return tasks.filter(task => task.fields.dateCreated > lastFetchEpochS)
            .map(task => ({
                epochMilliSeconds: task.fields.dateCreated * 1000,
                data: task
            }))
    }
}

export const newTask = createTrigger({
    // auth: check https://www.activepieces.com/docs/developers/piece-reference/authentication,
    name: 'newTask',
    displayName: 'New Task',
    description: 'Triggers when a new task is created',
    auth: phorgeAuth,
    props: {
        status: Property.ShortText({
            displayName: "Status",
            required: false,
            description: "Only trigger when task's have this status"
        })
    },
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