import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import { currentUser as queryCurrentUser } from './services/api';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { DashboardOutlined, InteractionOutlined, AppstoreOutlined, SettingOutlined, LinkOutlined, BookOutlined, CarryOutOutlined, CalendarOutlined } from '@ant-design/icons';
const iconEnum = {
    dashboard: <DashboardOutlined />,
    interaction: <InteractionOutlined />,
    appstore: <AppstoreOutlined />,
    setting: <SettingOutlined />,
    link: <LinkOutlined />,
    carry: <CarryOutOutlined />,
    calendar: <CalendarOutlined />,
};
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
    loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>;
    currentUser?: API.CurrentUser;
    fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
    const fetchUserInfo = async () => {
        try {
            const res = await queryCurrentUser();
            if (res.status === 'success') {
                return res.data;
            }
        } catch (error) {
            history.push(loginPath);
        }
        return undefined;
    };
    // 如果是登录页面，不执行
    if (history.location.pathname !== loginPath) {
        const currentUser = await fetchUserInfo();
        return {
            fetchUserInfo,
            currentUser,
            settings: {},
        };
    }
    return {
        fetchUserInfo,
        settings: {},
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
    return {
        rightContentRender: () => <RightContent />,
        disableContentMargin: false,
        waterMarkProps: {
            content: initialState?.currentUser?.name,
        },
        footerRender: () => <Footer />,
        onPageChange: () => {
            const { location } = history;
            // 如果没有登录，重定向到 login
            if (!initialState?.currentUser && location.pathname !== loginPath) {
                // history.push(loginPath);
            }
        },
        menu: {
            // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
            params: {
                userId: initialState?.currentUser?.name,
                menus: initialState?.currentUser?.menus
            },
            request: async (params, defaultMenuData) => {
                const mappingIcon = (menuData: any) => {
                    const mappingMenu = menuData.map((item: any) => ({
                        ...item,
                        icon: iconEnum[item.icon],
                        children: item.children ? mappingIcon(item.children) : [],
                    }));
                    return mappingMenu;
                };
                // initialState.currentUser 中包含了所有用户信息
                const { menus } = params
                const iconMenuData = mappingIcon(menus);
                return iconMenuData;
                // if (userId) {
                //     const res = await permission()
                //     if (res.status === 'success') {
                //         // menuData 为服务端获取的菜单数据
                //         const iconMenuData = mappingIcon(res.data);
                //         return iconMenuData;
                //     } else {
                //         return [];
                //     }
                // } else {
                //     return [];
                // }
            },
        },
        links: isDev
            ? [
                <Link to="/umi/plugin/openapi" target="_blank">
                    <LinkOutlined />
                    <span>OpenAPI 文档</span>
                </Link>,
                <Link to="/~docs">
                    <BookOutlined />
                    <span>业务组件文档</span>
                </Link>,
            ]
            : [],
        menuHeaderRender: undefined,
        // 自定义 403 页面
        unAccessible: <div>unAccessible</div>,
        ...initialState?.settings,
    };
};
