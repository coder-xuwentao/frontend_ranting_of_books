<template>
  <div class="app">
    <Header class="header"></Header>
    <Nuxt  class="main"/>
    <Footer class="footer"></Footer>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
}
.footer {
  margin-top: 100px;
  width: 100%;
}
.main{
  flex: 1;
  overflow: hidden;
}
</style>

