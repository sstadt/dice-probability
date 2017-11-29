<template>
  <div id="app">
    <Calculator/>
  </div>
</template>

<script>
import Calculator from './components/Calculator'

export default {
  name: 'app',
  components: {
    Calculator
  }
}
</script>

<style>
#app {
  padding: 50px 15px;
  margin: 0 auto;
  max-width: 1280px;
}
</style>
