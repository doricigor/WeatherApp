import Vue from 'vue';
import Vuex from 'vuex';
import Countries from './modules/Countries';
import Weather from './modules/Weather';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	modules: {
		Countries: Countries,
		Weather: Weather
	},

	strict: debug
})
