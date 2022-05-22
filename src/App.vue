<template>
	<div id="app">
		<YScrollContainerTest />
	</div>
</template>

<script>
import YScrollContainerTest from './components/YScrollContainerTest2.vue'

export default {
	name: 'App',
	components: {
		YScrollContainerTest,
	},
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
