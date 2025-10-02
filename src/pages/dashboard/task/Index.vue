<script setup lang="ts">
import moment from "moment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from "@/lib/axios";
import type { IMeta } from "@/types/meta";
import type { ITask } from "@/types/task";
import {
    ArrowDownNarrowWide,
    ArrowDownUp,
    ArrowUpNarrowWide,
    BatteryMedium,
    Clock,
    Flame,
    PackagePlus,
    Search,
    Snail,
    SquarePen,
    Trash2,
    User,
} from "lucide-vue-next";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { onMounted, reactive, ref, type Ref } from "vue";
import { BaseTooltip } from "@/components/ui/tooltip";

const filter = reactive({
    sortBy: "desc",
    searchKeyword: "",
});

const tasks: Ref<ITask[]> = ref([]);
const metaTask: Ref<IMeta> = ref({} as IMeta);
const dialog: Ref<boolean> = ref(false);

const fetchTasks = async ({
    page,
    search,
    sort = "desc",
}: {
    page: number;
    search?: string;
    sort?: string;
}) => {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "5");
        search && params.append("search", search);
        sort && params.append("sort", sort);

        const { data: response } = await api.get("/tasks", { params });

        if (response.data) {
            tasks.value = response.data;
            metaTask.value = response.meta;
        }
    } catch (error) {}
};

onMounted(() => {
    fetchTasks({ page: 1 });
});
</script>

<template>
    <section class="space-y-10">
        <header class="flex justify-between items-center">
            <h1 class="text-xl font-semibold text-gray-600">All Task</h1>

            <section class="flex items-center gap-4">
                <div class="relative w-full max-w-sm items-center">
                    <Input
                        id="search"
                        type="text"
                        v-model="filter.searchKeyword"
                        @keypress.enter="
                            () => {
                                fetchTasks({
                                    page: 1,
                                    search: filter.searchKeyword,
                                });
                            }
                        "
                        placeholder="Search and press enter..."
                        class="pl-8"
                    />
                    <span
                        class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
                    >
                        <Search class="size-4 text-muted-foreground" />
                    </span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline" class="cursor-pointer">
                            <ArrowDownUp />
                            <span>Sorting By</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-56">
                        <DropdownMenuLabel>Sorting Task</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            v-model="filter.sortBy"
                            @update:model-value="
                                (val) => {
                                    fetchTasks({ page: 1, sort: val });
                                }
                            "
                        >
                            <DropdownMenuRadioItem
                                value="desc"
                                class="flex gap-3"
                            >
                                <ArrowDownNarrowWide />
                                <span>Newest</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="asc">
                                <ArrowUpNarrowWide />
                                <span>Oldest</span>
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="outline"
                    class="cursor-pointer"
                    @click="dialog = true"
                >
                    <PackagePlus />
                    <span>New Task</span>
                </Button>
            </section>
        </header>

        <main class="space-y-10">
            <div class="space-y-5">
                <Alert
                    v-for="task in tasks"
                    :key="task.id"
                    class="flex justify-between items-center"
                >
                    <div class="space-y-1">
                        <header class="flex gap-3 items-center">
                            <Snail
                                v-if="task.priority == 'Low'"
                                class="h-4 w-4 !text-green-600"
                            />
                            <BatteryMedium
                                v-if="task.priority == 'Medium'"
                                class="h-4 w-4 !text-yellow-600"
                            />
                            <Flame
                                v-if="task.priority == 'High'"
                                class="h-4 w-4 !text-red-600"
                            />

                            <AlertTitle>{{ task.title }}</AlertTitle>
                        </header>
                        <AlertDescription class="ml-7 line-clamp-2 max-w-xl">
                            {{ task.description }}
                        </AlertDescription>
                        <div class="ml-7 flex gap-5 items-center mt-3">
                            <AlertDescription class="flex items-center gap-2">
                                <Clock class="w-3 h-3" />
                                <span>{{
                                    moment(task.createdAt).format("LL")
                                }}</span>
                            </AlertDescription>

                            <AlertDescription class="flex items-center gap-2">
                                <User class="w-4 h-4" />
                                <span>{{ task.createdBy }}</span>
                            </AlertDescription>
                        </div>
                    </div>

                    <div class="space-x-3">
                        <BaseTooltip message="Delete Task?">
                            <Button
                                size="icon"
                                variant="ghost"
                                class="cursor-pointer"
                            >
                                <SquarePen class="size-4 !text-yellow-600" />
                            </Button>
                        </BaseTooltip>

                        <BaseTooltip message="Delete Task?">
                            <Button
                                size="icon"
                                variant="ghost"
                                class="cursor-pointer"
                            >
                                <Trash2 class="size-4 !text-red-600" />
                            </Button>
                        </BaseTooltip>
                    </div>
                </Alert>
            </div>

            <Pagination
                v-slot="{ page }"
                :items-per-page="metaTask?.limit || 5"
                :total="metaTask?.total"
                :default-page="1"
            >
                <PaginationContent v-slot="{ items }">
                    <PaginationPrevious
                        @click="
                            () => {
                                fetchTasks({ page });
                            }
                        "
                    />

                    <template v-for="(item, index) in items" :key="index">
                        <PaginationItem
                            v-if="item.type === 'page'"
                            :value="item.value"
                            :is-active="item.value === page"
                        >
                            {{ item.value }}
                        </PaginationItem>
                    </template>

                    <PaginationEllipsis :index="4" />

                    <PaginationNext
                        @click="
                            () => {
                                fetchTasks({ page });
                            }
                        "
                    />
                </PaginationContent>
            </Pagination>
        </main>
    </section>

    <Dialog v-model:open="dialog">
        <DialogContent class="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>New Task</DialogTitle>
                <DialogDescription>
                    Please fill all field that you need on below.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button type="submit"> Save changes </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
