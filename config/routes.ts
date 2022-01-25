export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user',
                routes: [
                    {
                        name: 'login',
                        path: '/user/login',
                        component: './user/login',
                    },
                ],
            },
            {
                component: './404',
            },
        ],
    },
    {
        icon: 'dashboard',
        name: 'dashboard',
        path: '/dashboard',
        component: './welcome',
    },
    {
        icon: 'appstore',
        name: 'project',
        path: '/project',
        component: './project',
    },
    {
        icon: 'carry',
        name: 'propose',
        path: '/propose',
        component: './propose',
    },
    {
        icon: 'setting',
        name: 'system',
        path: '/system',
        routes: [
            {
                icon: 'link',
                name: 'permission',
                path: '/system/permission',
                component: './system/permission'
            },
            {
                icon: 'link',
                name: 'role',
                path: '/system/role',
                component: './system/role'
            },
            {
                icon: 'link',
                name: 'department',
                path: '/system/department',
                component: './system/department'
            },
            {
                icon: 'link',
                name: 'user',
                path: '/system/user',
                component: './system/user'
            },
            {
                icon: 'link',
                name: 'notice',
                path: '/system/notice',
                component: './system/notice'
            },
            {
                icon: 'link',
                name: 'log',
                path: '/system/log',
                component: './system/log'
            },
            {
                component: './404',
            },
        ]
    },
    // {
    //     path: '/admin',
    //     name: 'admin',
    //     icon: 'crown',
    //     access: 'canAdmin',
    //     component: './admin',
    //     routes: [
    //         {
    //             path: '/admin/sub-page',
    //             name: 'sub-page',
    //             icon: 'smile',
    //             component: './welcome',
    //         },
    //         {
    //             component: './404',
    //         },
    //     ],
    // },
    // {
    //     name: 'list.table-list',
    //     icon: 'table',
    //     path: '/list',
    //     component: './TableList',
    // },
    // {
    //     name: 'list.table-list',
    //     icon: 'table',
    //     path: '/table',
    //     component: './Table',
    // },
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/401',
        component: './401',
    },
    {
        path: '/403',
        component: './403',
    },
    {
        path: '/500',
        component: './500',
    },
    {
        component: './404',
    },
];
