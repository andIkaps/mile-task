<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { Eye, EyeOff, Loader2, LockIcon, User } from "lucide-vue-next";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const formData = reactive({
    username: "",
    password: "",
});

const errors = reactive({
    username: "",
    password: "",
});

const isLoading = ref(false);
const showPassword = ref(false);

const validateForm = () => {
    let isValid = true;

    if (!formData.username) {
        errors.username = "Please enter your username";
        isValid = false;
    } else {
        errors.username = "";
    }

    // Password validation
    if (!formData.password) {
        errors.password = "Please enter your password";
        isValid = false;
    } else {
        errors.password = "";
    }

    return isValid;
};

const handleSubmit = async () => {
    if (validateForm()) {
        try {
            isLoading.value = true;

            const { data: response } = await api.post("/login", {
                username: formData.username,
                password: formData.password,
            });

            if (response.data) {
                const { token, user } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("userData", JSON.stringify(user));

                router.push({
                    name: "task-index",
                });
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            isLoading.value = false;
        }
    }
};
</script>

<template>
    <section
        class="relative w-full h-screen flex items-center bg-background py-8 md:py-16 lg:py-24"
    >
        <div class="container mx-auto px-4 md:px-6 lg:px-24">
            <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <!-- Right side with form -->
                <div class="w-full lg:w-1/2 space-y-8">
                    <div class="space-y-2 text-center lg:text-left">
                        <h1 class="text-5xl font-bold">Welcome back</h1>
                        <p class="text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <div class="space-y-4">
                            <div class="space-y-2">
                                <Label for="email">Username</Label>
                                <div class="relative">
                                    <User
                                        class="absolute left-3 top-2 h-5 w-5 text-muted-foreground"
                                    />
                                    <Input
                                        id="email"
                                        v-model="formData.username"
                                        placeholder="Enter your username"
                                        :class="{
                                            'border-red-500': errors.username,
                                            'pl-10': true,
                                        }"
                                        :disabled="isLoading"
                                        required
                                    />
                                </div>
                                <p
                                    v-if="errors.username"
                                    class="text-sm text-red-500"
                                >
                                    {{ errors.username }}
                                </p>
                            </div>

                            <div class="space-y-2">
                                <Label for="password">Password</Label>
                                <div class="relative">
                                    <LockIcon
                                        class="absolute left-3 top-2 h-5 w-5 text-muted-foreground"
                                    />
                                    <Input
                                        id="password"
                                        v-model="formData.password"
                                        :type="
                                            showPassword ? 'text' : 'password'
                                        "
                                        placeholder="Enter your password"
                                        :class="{
                                            'border-red-500': errors.password,
                                            'pl-10': true,
                                        }"
                                        :disabled="isLoading"
                                        required
                                    />
                                    <button
                                        type="button"
                                        class="absolute right-3 top-2"
                                        :disabled="isLoading"
                                        @click="showPassword = !showPassword"
                                    >
                                        <Eye
                                            v-if="!showPassword"
                                            class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                                        />
                                        <EyeOff
                                            v-else
                                            class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                                        />
                                    </button>
                                </div>
                                <p
                                    v-if="errors.password"
                                    class="text-sm text-red-500"
                                >
                                    {{ errors.password }}
                                </p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            class="w-full group"
                            :disabled="isLoading"
                        >
                            <span
                                v-if="!isLoading"
                                class="group-hover:translate-x-0.5 transition-transform"
                            >
                                Sign in
                            </span>
                            <span
                                v-else
                                class="flex items-center justify-center"
                            >
                                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </span>
                        </Button>
                    </form>
                </div>

                <!-- Left side with image -->
                <div class="w-full lg:w-1/2">
                    <img
                        src="https://shadcnblocks-vue.com/placeholder.jpg"
                        class="w-full rounded-2xl shadow-xl aspect-[4/3]"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
