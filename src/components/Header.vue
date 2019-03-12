<template>
    <header class="header">
        <p>Saturday</p>
        <!--<img :src="logo"/>-->
        <div id="nav">
            <!--<router-link to="/">Home</router-link>|
            <router-link to="/about">About</router-link>-->
        </div>
    </header>
</template>

<script>
//import logo from '../assets/saturday.png';
export default {
    name: 'Header',
    /*data: function() {
        return {
        logo: logo
        }
    }*/
}
</script>

<style scoped>
    .header {
        background: #fff;
        color: #616161;
        text-align: center;
        padding: 20px 10px 20px 10px;
        font-size: 40px;
        font-weight: 300;
    }

    .header a {
        color: #fff;
        padding-right: 5px;
        text-decoration: none;
    }
</style>
