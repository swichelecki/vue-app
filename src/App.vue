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

html {
    height: 100%;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
    height: 100%;
}

.flex-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
}

.container {
    max-width: 500px;
}

.btn {
    display: inline-block;
    border: none;
    background: #555;
    color: #fff;
    padding: 7px 20px;
    cursor: pointer;
}
</style>
