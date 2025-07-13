<template>
    <wwEditorInputRow
        label="Access token"
        type="query"
        :model-value="accessToken"
        bindable
        placeholder="Enter a access token"
        required
        @update:modelValue="setAccessToken"
    />
    <wwEditorInputRow
        label="Refresh token"
        type="query"
        :model-value="refreshToken"
        bindable
        placeholder="Enter a refresh token"
        @update:modelValue="setRefreshToken"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        accessToken() {
            return this.args.accessToken;
        },
        refreshToken() {
            return this.args.refreshToken;
        },
    },
    methods: {
        setAccessToken(accessToken) {
            this.$emit('update:args', { ...this.args, accessToken });
        },
        setRefreshToken(refreshToken) {
            this.$emit('update:args', { ...this.args, refreshToken });
        },
    },
};
</script>
