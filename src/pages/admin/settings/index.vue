<template>
    <div class="main">
        <div class="main__content-row">
            <reset-password class="w100"></reset-password>
        </div>
    </div>
</template>
<script>
import ResetPassword from '@/views/main/Settings/components/ResetPassword'
export default {
    name: 'AdminSettings',
    components: { 'reset-password': ResetPassword }
}
</script>
<style lang="scss">
    .w100{
        padding: 20px !important;
        width: 100%;
        overflow-x: hidden;
    }
</style>