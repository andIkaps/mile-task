<script setup lang="ts">
import Tooltip from "./Tooltip.vue";
import TooltipContent from "./TooltipContent.vue";
import TooltipProvider from "./TooltipProvider.vue";
import TooltipTrigger from "./TooltipTrigger.vue";

defineProps({
    message: String,
});
</script>

<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <slot />
            </TooltipTrigger>
            <TooltipContent>
                <p>{{ message }}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>
