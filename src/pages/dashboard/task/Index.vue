<script setup lang="ts">
import empty_image from "@/assets/empty.png";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { BaseTooltip } from "@/components/ui/tooltip";
import { api } from "@/lib/axios";
import type { IMeta } from "@/types/meta";
import type { ITask } from "@/types/task";
import {
    ArrowDownNarrowWide,
    ArrowDownUp,
    ArrowUpNarrowWide,
    Clock,
    PackagePlus,
    Search,
    Siren,
    Snail,
    SquarePen,
    Trash2,
    TriangleAlert,
    User,
} from "lucide-vue-next";
import moment from "moment";
import { useForm } from "vee-validate";
import { onMounted, reactive, ref, watch, type Ref } from "vue";
import { toast } from "vue-sonner";
import { taskSchema } from "./schema";

const userData = ref(JSON.parse(localStorage.getItem("userData") || "{}"));

const filter = reactive({
    sortBy: "desc",
    searchKeyword: "",
});
const tasks: Ref<ITask[]> = ref([]);
const metaTask: Ref<IMeta> = ref({} as IMeta);
const taskId = ref<number>();
const dialog: Ref<boolean> = ref(false);
watch(dialog, () => {
    if (!dialog.value) {
        resetForm();
        taskId.value = 0;
    }
});
const isLoading = ref(false);

const { isFieldDirty, handleSubmit, resetForm, setValues } = useForm({
    validationSchema: taskSchema,
    initialValues: {
        title: "",
        description: "",
        priority: "",
    },
});

const fetchTasks = async ({
    page = 1,
    search,
    sort = "desc",
}: {
    page?: number;
    search?: string;
    sort?: string;
}) => {
    try {
        isLoading.value = true;

        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "5");
        params.append("createdBy", userData.value?.username);
        search && params.append("search", search);
        sort && params.append("sort", sort);

        const { data: response } = await api.get("/tasks", { params });

        if (response.data) {
            tasks.value = response.data;
            metaTask.value = response.meta;
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};

const onSubmitTask = handleSubmit(async (values) => {
    try {
        const { data: response } = await api.post(
            taskId.value ? `/tasks/${taskId.value}` : "/tasks",
            {
                ...values,
                createdBy: userData.value?.username,
            }
        );

        if (response.data) {
            toast.success(response.message);
            dialog.value = false;

            fetchTasks({ page: 1 });
        }
    } catch (error) {
        console.log(error);
    }
});

const onDelete = async () => {
    try {
        isLoading.value = true;

        const { data: response } = await api.delete(`/tasks/${taskId.value}`);

        if (response.data) {
            toast.success(response.message);

            fetchTasks({ page: 1 });
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
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

        <main v-if="tasks.length" class="space-y-10">
            <div v-if="!isLoading" class="space-y-5">
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
                            <TriangleAlert
                                v-if="task.priority == 'Medium'"
                                class="h-4 w-4 !text-yellow-600"
                            />
                            <Siren
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
                        <BaseTooltip message="Update Task?">
                            <Button
                                size="icon"
                                variant="ghost"
                                class="cursor-pointer"
                                @click="
                                    () => {
                                        taskId = task.id;
                                        dialog = true;

                                        setValues({
                                            title: task.title,
                                            description:
                                                task.description || '-',
                                            priority: task.priority,
                                        });
                                    }
                                "
                            >
                                <SquarePen class="size-4 !text-yellow-600" />
                            </Button>
                        </BaseTooltip>

                        <BaseTooltip message="Delete Task?">
                            <AlertDialog>
                                <AlertDialogTrigger as-child>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="cursor-pointer"
                                        @click="taskId = task.id"
                                    >
                                        <Trash2 class="size-4 !text-red-600" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle
                                            >Are you absolutely
                                            sure?</AlertDialogTitle
                                        >
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete your account
                                            and remove your data from our
                                            servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel @click="taskId = 0">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction @click="onDelete">
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </BaseTooltip>
                    </div>
                </Alert>
            </div>
            <template v-else>
                <Skeleton
                    v-for="i in 5"
                    :key="i"
                    class="h-22 w-full rounded-sm"
                />
            </template>

            <Pagination
                v-slot="{ page }"
                :items-per-page="metaTask?.limit || 5"
                :total="metaTask?.total"
                :default-page="1"
            >
                <PaginationContent
                    v-slot="{ items }"
                    :class="{
                        'pointer-events-none': isLoading,
                    }"
                >
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
        <div v-else>
            <section
                class="w-full py-10 flex flex-col justify-center items-center text-center gap-2"
            >
                <img :src="empty_image" class="w-28" />

                <h1 class="text-lg font-semibold">Task Empty</h1>
                <p class="text-sm">
                    <span class="text-gray-500">
                        The task you added will be displayed here.
                    </span>
                </p>
            </section>
        </div>
    </section>

    <Dialog v-model:open="dialog">
        <DialogContent class="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>{{ taskId ? "Update" : "New" }} Task</DialogTitle>
                <DialogDescription>
                    Please fill all field that you need on below.
                </DialogDescription>
            </DialogHeader>

            <form @submit="onSubmitTask" class="space-y-5">
                <FormField
                    v-slot="{ componentField }"
                    name="title"
                    :validate-on-blur="!isFieldDirty"
                >
                    <FormItem>
                        <FormLabel>
                            <span>Title</span>
                            <small className="text-red-600 text-xs">
                                (*)
                            </small>
                        </FormLabel>
                        <FormControl>
                            <Input type="text" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="description">
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                class="resize-none"
                                v-bind="componentField"
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="priority">
                    <FormItem>
                        <FormLabel>
                            <span>Priority</span>
                            <small className="text-red-600 text-xs">
                                (*)
                            </small>
                        </FormLabel>

                        <Select v-bind="componentField">
                            <FormControl>
                                <SelectTrigger class="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Low">
                                        <Snail
                                            class="h-4 w-4 !text-green-600"
                                        />
                                        <span>Low</span>
                                    </SelectItem>
                                    <SelectItem value="Medium">
                                        <TriangleAlert
                                            class="h-4 w-4 !text-yellow-600"
                                        />
                                        <span>Medium</span>
                                    </SelectItem>
                                    <SelectItem value="High">
                                        <Siren class="h-4 w-4 !text-red-600" />
                                        <span>High</span>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <DialogFooter>
                    <Button type="submit"> Save changes </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
