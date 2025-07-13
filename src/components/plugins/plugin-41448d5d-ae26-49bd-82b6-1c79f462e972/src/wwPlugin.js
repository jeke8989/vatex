
const ACCESS_COOKIE_NAME = 'ww-auth-access-token';
const REFRESH_COOKIE_NAME = 'ww-auth-refresh-token';

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    async _onLoad() {
        let refreshPromise = null;
        axios.interceptors.response.use(null, async error => {
            const { refreshTokenEndpoint } = this.settings.publicData;
            const isRefreshRequest = error?.response?.config?.url === refreshTokenEndpoint;
            const isRetry = error?.response?.config?.headers['ww-retry'];
            const status = error.response ? error.response.status : null;
            if (status === 401 && !isRefreshRequest && !isRetry) {
                try {
                    if (!refreshPromise) {
                        refreshPromise = this.refreshAccessToken();
                    }
                    await refreshPromise;
                    refreshPromise = null;
                    error.config.headers = {
                        'ww-retry': true,
                        ...error.config.headers,
                        ...buildHeader(
                            this.settings.publicData.type,
                            this.settings.publicData.name,
                            wwLib.wwVariable.getValue(`${this.id}-accessToken`)
                        ),
                    };
                    return axios.request(error.config);
                } catch (err) {
                    wwLib.wwLog.error('Unable to get access token from refresh token.');
                }
            }
            return Promise.reject(error);
        });
    },
    async _initAuth() {
        const accessToken = window.vm.config.globalProperties.$cookie.getCookie(ACCESS_COOKIE_NAME);
        const refreshToken = window.vm.config.globalProperties.$cookie.getCookie(REFRESH_COOKIE_NAME);
        wwLib.wwVariable.updateValue(`${this.id}-accessToken`, accessToken);
        wwLib.wwVariable.updateValue(`${this.id}-refreshToken`, refreshToken);

        if (accessToken) await this.fetchUser();
    },
    /*=============================================m_ÔÔ_m=============================================\
        Auth API
    \================================================================================================*/
    /*=============================================m_ÔÔ_m=============================================\
        Auth Token API
    \================================================================================================*/
    storeToken({ accessToken, refreshToken }) {
        if (accessToken) {
            window.vm.config.globalProperties.$cookie.setCookie(ACCESS_COOKIE_NAME, accessToken, {
                expire: '1y',
                secure: true,
            });
            wwLib.wwVariable.updateValue(`${this.id}-accessToken`, accessToken);
        }
        if (refreshToken) {
            window.vm.config.globalProperties.$cookie.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
                expire: '1y',
                secure: true,
            });
            wwLib.wwVariable.updateValue(`${this.id}-refreshToken`, refreshToken);
        }
    },
    removeToken() {
        window.vm.config.globalProperties.$cookie.removeCookie(ACCESS_COOKIE_NAME);
        wwLib.wwVariable.updateValue(`${this.id}-accessToken`, null);
        window.vm.config.globalProperties.$cookie.removeCookie(REFRESH_COOKIE_NAME);
        wwLib.wwVariable.updateValue(`${this.id}-refreshToken`, null);
    },
    async fetchUser() {
        const { userEndpoint, type, name } = this.settings.publicData;
        const accessToken = wwLib.wwVariable.getValue(`${this.id}-accessToken`);

        if (!userEndpoint) throw new Error('No user endpoint defined.');
        if (!type) throw new Error('No Auth type defined.');

        try {
            const { data } = await axios.get(userEndpoint, { headers: buildHeader(type, name, accessToken) });
            wwLib.wwVariable.updateValue(`${this.id}-user`, data);
            wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, true);
            return data;
        } catch (err) {
            throw err;
        }
    },
    async refreshAccessToken() {
        const {
            refreshTokenEndpoint,
            refreshFieldRequest,
            refreshFieldResponse,
            refreshType = 'custom-body',
        } = this.settings.publicData;
        const refreshToken = wwLib.wwVariable.getValue(`${this.id}-refreshToken`);

        if (!refreshTokenEndpoint) throw new Error('No refresh token endpoint defined.');
        const headers = buildHeader(refreshType, refreshFieldRequest, refreshToken);
        const body = refreshType === 'custom-body' ? { [refreshFieldRequest]: refreshToken } : {};
        const { data } = await axios.post(refreshTokenEndpoint, body, headers);
        const accessToken = _.get(data, refreshFieldResponse, data);
        this.storeToken({ accessToken });

        return data;
    },
    logout() {
        this.removeToken();
        wwLib.wwVariable.updateValue(`${this.id}-user`, null);
        wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, false);
    },
};

const buildHeader = (type, name, token) => {
    switch (type) {
        case 'bearer-token':
            return { Authorization: `Bearer ${token}` };
        case 'basic-token':
            return { Authorization: `Basic ${token}` };
        case 'custom-header':
            return { [name]: token };
        default:
            return {};
    }
};
