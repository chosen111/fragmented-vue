<template>
  <main class="vue_404">
    <div class="error">
      <div class="bwonsamdi"></div>
      <span class="message">{{ quote }}</span>      
    </div>    
  </main>
</template>

<script>
export default { 
  computed: {
    quote() {
      let quotes = [
        "What you be doin’ here, mon? It not your time to click on that link… yet.",
        "Tsk, tsk. I did not expect to be seein’ ya here so soon.",
        "Let me guess… ya got in over ya head?",
        "Haha! Now dat was an impressive link!",
        "Ya be tryin' ta feign links, mon? Shame...",
        "Hah! Ya didn't roll out of dat 404.",
        "I tink ya followed da wrong link, mon.",        
      ]
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.error {
  align-self: center;
  justify-self: center;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  .bwonsamdi {
    position: relative;
    width: 256px;
    height: 256px;
    border-radius: 128px;
    margin-bottom: 20px;
    background: url('~assets/images/bwonsamdi.jpg') no-repeat 60% top;
    background-size: 300%;

    &:after {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: radial-gradient(transparent 0%, #000 75%); 
      border-radius: 128px;     
    }
  }
}
</style>
