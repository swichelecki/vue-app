<template>
  <div id="app" class="flex-wrapper">
      <div class="container">
          <Header />
          <router-view/>
      </div>
  </div>
</template>

<script>
import Header from './components/layout/Header';
export default {
  name: 'app',
  components: {
      Header
  }
}
</script>

<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
}

.container {
    max-width: 600px;
    margin: 0 auto;
}

</style>
