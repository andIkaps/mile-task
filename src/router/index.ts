import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: "/", component: () => import("../pages/example/index.vue") },
    {
        path: "/dashboard",
        component: () => import("../pages/dashboard/Layout.vue"),
        name: "dashboard",
        children: [
            {
                path: "task",
                name: "task-index",
                component: () => import("../pages/dashboard/task/Index.vue"),
            },
        ],
    },

    {
        path: "/auth/login",
        component: () => import("../pages/login/Index.vue"),
        name: "login-index",
    },
    {
        path: "/:catchAll(.*)*",
        component: () => import("../pages/not-found/index.vue"),
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
