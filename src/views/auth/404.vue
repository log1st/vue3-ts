<template>
  <div class="login">
    <div class="login__title">
      <icon-base
        width="250"
        height="75"
        :viewbox="'0 0 1918 606'"
        ><icon-urrobot />
      </icon-base>
    </div>
    <div class="login__subtitle">
      <h2>Страница не найдена</h2>
      <router-link class="login__subtitle-404" to="/login">Войти в систему или зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script>
export default {
}
</script>
