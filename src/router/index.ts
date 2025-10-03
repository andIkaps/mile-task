import { createRouter, createWebHistory } from "vue-router";

const authRequired = (to: any, from: any, next: any) => {
    const token = localStorage.getItem("token");
    console.log(from);

    if (!token) {
        next({ name: "login-index" });
    } else {
        if (to.path == "/") {
            next({ name: "task-index" });
        }

        next();
    }
};

const routes = [
    {
        path: "/",
        component: () => import("../pages/dashboard/task/Index.vue"),
        beforeEnter: authRequired,
    },
    {
        path: "/dashboard",
        component: () => import("../pages/dashboard/Layout.vue"),
        name: "dashboard",
        children: [
            {
                path: "task",
                name: "task-index",
                component: () => import("../pages/dashboard/task/Index.vue"),
                beforeEnter: authRequired,
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
