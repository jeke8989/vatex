export default {
    features: {
        auth: true,
    },
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEdit.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid(settings) {
                    const { userEndpoint, type } = settings.publicData;
                    return !!userEndpoint && !!type;
                },
            },
        ],
        designSystemId: '34d431d4-405c-4969-8ac6-658be9787c67',
    },
    variables: [
        { name: 'user', value: 'user', type: 'object', defaultValue: null },
        { name: 'accessToken', value: 'accessToken', type: 'string', defaultValue: null },
        { name: 'refreshToken', value: 'refreshToken', type: 'string', defaultValue: null },
        { name: 'isAuthenticated', value: 'isAuthenticated', type: 'boolean', defaultValue: false },
    ],
    actions: [
        {
            name: 'Fetch User',
            code: 'fetchUser',
            isAsync: true,
        },
        {
            name: 'Store token',
            code: 'storeToken',
        },
        {
            name: 'Logout',
            code: 'logout',
        },
    ],
};
