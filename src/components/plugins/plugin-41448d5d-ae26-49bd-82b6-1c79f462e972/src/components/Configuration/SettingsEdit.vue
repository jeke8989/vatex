<template>
    <div class="auth-token-settings-edit">
        <wwEditorFormRow required label="Auth type">
            <wwEditorInputTextSelect
                placeholder="Select a type of authentication"
                :model-value="settings.publicData.type"
                :options="typeOptions"
                @update:modelValue="setType"
            />
        </wwEditorFormRow>
        <wwEditorFormRow v-if="settings.publicData.type === 'custom-header'" required label="Custom header name">
            <wwEditorInputText
                placeholder="Enter a header key name"
                :model-value="settings.publicData.name"
                @update:modelValue="setName"
            />
        </wwEditorFormRow>
        <wwEditorFormRow required label="User endpoint">
            <wwEditorInputText
                type="text"
                placeholder="https://api-url.com/users/me"
                :model-value="settings.publicData.userEndpoint"
                @update:modelValue="setUserEndpoint"
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Refresh token endpoint">
            <wwEditorInputText
                type="text"
                placeholder="https://api-url.com/token/refresh"
                :model-value="settings.publicData.refreshTokenEndpoint"
                @update:modelValue="setRefreshTokenEndpoint"
            />
        </wwEditorFormRow>
        <template v-if="settings.publicData.refreshTokenEndpoint">
            <wwEditorFormRow label="Refresh token through">
                <wwEditorInputTextSelect
                    placeholder="Select refresh token type"
                    :model-value="settings.publicData.refreshType"
                    :options="refreshTypeOptions"
                    @update:modelValue="setRefreshType"
                />
            </wwEditorFormRow>
            <wwEditorFormRow
                v-if="['custom-body', 'custom-header'].includes(settings.publicData.refreshType)"
                label="Refresh token field/header request key"
            >
                <wwEditorInputText
                    type="text"
                    placeholder="refresh"
                    :model-value="settings.publicData.refreshFieldRequest"
                    @update:modelValue="setRefreshFieldRequest"
                />
            </wwEditorFormRow>
            <wwEditorFormRow label="Access token field response key">
                <wwEditorInputText
                    type="text"
                    placeholder="access"
                    :model-value="settings.publicData.refreshFieldResponse"
                    @update:modelValue="setRefreshFieldResponse"
                />
            </wwEditorFormRow>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            typeOptions: [
                { label: 'Auth Bearer Token', value: 'bearer-token' },
                { label: 'Auth Basic Token', value: 'basic-token' },
                { label: 'Custom Header', value: 'custom-header' },
            ],
            refreshTypeOptions: [
                { label: 'Request Body', value: 'custom-body' },
                { label: 'Bearer Token Header', value: 'bearer-token' },
                { label: 'Basic Token Header', value: 'basic-token' },
                { label: 'Custom Header', value: 'custom-header' },
            ],
        };
    },
    methods: {
        setUserEndpoint(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, userEndpoint: value },
            });
        },
        setRefreshTokenEndpoint(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, refreshTokenEndpoint: value },
            });
        },
        setType(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, type: value },
            });
        },
        setName(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, name: value },
            });
        },
        setRefreshFieldRequest(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, refreshFieldRequest: value },
            });
        },
        setRefreshFieldResponse(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, refreshFieldResponse: value },
            });
        },
        setRefreshType(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, refreshType: value },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.auth-token-settings-edit {
    display: flex;
    flex-direction: column;
    &__link {
        color: var(--ww-color-content-brand);
        margin-left: var(--ww-spacing-02);
    }
    &__row {
        display: flex;
        align-items: center;
    }
    &__radio-label {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
