/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
    const { currentUser } = initialState || {};
    console.log('currentUser:', currentUser)
    return {
        canAdmin: currentUser && currentUser.access === 'admin',
        canSuper: currentUser && currentUser.super === 'super',
        canProjectCreated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('项目添加')),
        canProjectUpdated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('项目更新')),
        canProjectFreeze: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('项目冻结')),
        canProjectUnfreeze: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('项目解冻')),

        canProposeFreeze: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('建议冻结')),
        canProposeUnfreeze: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('建议解冻')),
        canProposeConsult: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('建议查阅')),
        canProposeDetail: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('建议详情')),
        canProposeGenerate: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('建议生成')),
        canProposeExport: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('建议导出')),

        canPermissionCreated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('菜单添加')),
        canPermissionUpdated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('菜单更新')),
        canPermissionDeleted: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('菜单删除')),
        canRoleCreated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('角色添加')),
        canRoleUpdated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('角色更新')),
        canRoleDeleted: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('角色删除')),
        canRoleBind: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('角色绑定权限')),
        canRoleClear: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('角色清除权限')),
        canDepartmentCreated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('部门添加')),
        canDepartmentUpdated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('部门更新')),
        canDepartmentDeleted: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('部门删除')),
        canUserCreated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('用户添加')),
        canUserUpdated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('用户更新')),
        canUserFreeze: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('用户冻结')),
        canUserUnfreeze: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('用户解冻')),
        canUserBind: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('用户绑定权限')),
        canUserClear: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('用户清除权限')),
        canNoticeCreated: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('公告添加')),
        canNoticeDetail: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('公告详情')),
        canNoticeDeleted: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('公告删除')),
        canNoticeWithdraw: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('公告撤回')),
        canLogDeleted: (currentUser && currentUser.super === 'super') || (currentUser && currentUser.permissions.map((v: any) => v.title).includes('操作删除')),
    };
}
