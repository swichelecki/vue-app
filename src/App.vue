<template>
  <div id="app" class="flex-wrapper">
      <div class="container">
          <!--<Header />-->
          <router-view/>
      </div>
  </div>
</template>

<script>
//import Header from './components/Header';
export default {
  name: 'app',
  /*components: {
      Header
  }*/
}
</script>

<style>

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Work Sans', sans-serif;
    line-height: 1.4;
    background-color: #f4f4f4;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),
    0 3px 1px -2px rgba(0,0,0,.12),
    0 1px 5px 0 rgba(0,0,0,.2);
}

</style>
