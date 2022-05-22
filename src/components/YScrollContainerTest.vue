<template>
	<YScrollContainer class="container" :hoverStop="false" :scrollStep="1" direction="down">
		<div>
			<div class="row" v-for="item in list" :key="item.name">
				{{ item.name }}
			</div>
		</div>
		<div>{{ asyncValue }}</div>
	</YScrollContainer>
</template>

<script>
import YScrollContainer from '../../plugins/components/YScrollContainer/YScrollContainer.vue'
export default {
	components: {
		YScrollContainer,
	},
	data() {
		return {
			list: [],
			asyncValue: '0000000',
		}
	},
	mounted() {
		setTimeout(() => {
			this.list = [
				{
					name: 1,
				},
				{
					name: 2,
				},
				{
					name: 3,
				},
				{
					name: 4,
				},
				{
					name: 5,
				},
			]
		}, 2000)
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
