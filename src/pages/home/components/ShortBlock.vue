<template>
    <div class="s-card">
        <span class="s-card-title">{{ title }}</span>
        <div class="s-card-content">
            <span class="s-card-content__title">{{ count }} %</span>
            <!-- <span class=""><b>Выплачено</b> в этом месяце</span> -->
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ShortBlockFirst',
        props: ['title', 'count']
    }
</script>

<style lang="scss">
    .s-card {
        background-color: #fff;
        border-radius: 6px;
        padding: 16px 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &-title {
            opacity: 0.5;
            color: #5e6476;
            // font-family: Roboto;
            font-size: 12px;
            font-weight: 400;
            line-height: 21px;
        }

        &-content__title {
            color: #5e6476;
            font-size: 36px;
            font-weight: 500;
            line-height: 25px;
        }

    }
</style>