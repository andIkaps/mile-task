<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-vue-next";
import { ref } from "vue";

const isOpen = ref(false);

const leftNavigation = [{ name: "My Task", href: "#" }];

const rightNavigation = [{ name: "Profile", href: "#" }];
</script>

<template>
    <section
        class="relative w-full flex items-center bg-white py-8 md:py-16 lg:py-24"
    >
        <div class="container mx-auto px-4 md:px-6 lg:px-8">
            <nav class="flex items-center justify-between">
                <!-- Left Navigation -->
                <div class="hidden md:flex items-center space-x-8">
                    <RouterLink
                        :to="{ name: 'task-index' }"
                        class="text-gray-600 hover:text-gray-900"
                    >
                        My Task
                    </RouterLink>
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden">
                    <Button variant="ghost" @click="isOpen = !isOpen">
                        <Menu v-if="!isOpen" class="h-6 w-6" />
                        <X v-else class="h-6 w-6" />
                    </Button>
                </div>

                <!-- Logo (Centered) -->
                <div class="flex-1 flex justify-center md:flex-none">
                    <span class="text-2xl font-bold">MILE TASK</span>
                </div>

                <!-- Right Navigation -->
                <div class="flex items-center space-x-8">
                    <div class="hidden md:flex items-center space-x-8">
                        <a
                            v-for="item in rightNavigation"
                            :key="item.name"
                            :href="item.href"
                            class="text-gray-600 hover:text-gray-900"
                        >
                            {{ item.name }}
                        </a>
                    </div>
                    <Button variant="ghost" size="icon">
                        <LogOut class="h-5 w-5" />
                    </Button>
                </div>
            </nav>

            <!-- Mobile Navigation Menu -->
            <div
                v-if="isOpen"
                class="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 py-4"
            >
                <div class="container mx-auto px-4">
                    <div class="flex flex-col space-y-4">
                        <a
                            v-for="item in [
                                ...leftNavigation,
                                ...rightNavigation,
                            ]"
                            :key="item.name"
                            :href="item.href"
                            class="text-gray-600 hover:text-gray-900"
                        >
                            {{ item.name }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <main class="container mx-auto px-4 md:px-6 lg:px-8">
        <RouterView />
    </main>
</template>
