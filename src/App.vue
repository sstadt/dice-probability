<template>
  <div id="app">
    <calculator/>
  </div>
</template>

<script>
import calculator from './components/Calculator';

export default {
  name: 'app',
  components: {
    calculator
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
