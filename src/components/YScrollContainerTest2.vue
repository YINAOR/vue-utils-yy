<template>
	<YScrollContainer style="height: 300px">
		<HelloWorld msg="Welcome to Your Vue.js App" />
	</YScrollContainer>
</template>

<script>
import HelloWorld from './HelloWorld.vue'
import YScrollContainer from '../../plugins/components/YScrollContainer/YScrollContainer.vue'
export default {
	name: 'App',
	components: {
		HelloWorld,
		YScrollContainer,
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
	height: 400px;
	background: red;
}
.row {
	width: 100%;
	height: 100px;
	background: burlywood;
	color: aliceblue;
	text-align: center;
	line-height: 100px;
}
</style>
