<template>
	<div id="app">
		<div class="weather__wrap" :class="{'loaded': isLoaded, 'initBg': !used}" :style="{background: tenDays.length ? tempBackground : '' }">
			<div class="weather__error" v-if="noResult">
				<span class="weather__error-msg">No results for that city!</span>
			</div>
			<Weather/>
		</div>
	</div>
</template>

<script>
    import { mapState } from 'vuex';
	import Weather from '@/components/Weather';

	export default {
		name: 'App',

		components: {
			Weather
		},

		// Fetch all countries when app start
		async beforeMount() {
			if (!this.countries.length) {
				this.$store.dispatch('getCountries');
			}
		},

		computed: {
            ...mapState({
                countries: state => state.Countries.countries,
				isLoaded: state => state.Countries.isLoaded,
                noResult: state => state.Weather.noResult,
                tenDays: state => state.Weather.tenDays,
                used: state => state.Weather.used,
            }),

			tempBackground() {
				return this.$store.getters.getTempBackground;
			}
		}
	}
</script>

<style lang="scss">
	.weather__wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 100%;
		height: 100vh;

		&::after {
			content: '';
			position: fixed;
			width: 100%;
			height: 100%;
			background: linear-gradient(
				0deg,
				rgba(255, 255, 255, 0.8),
				rgba(255, 255, 255, 0.8)
				),
				linear-gradient(
				133.86deg,
				#102f7e -11.47%,
				#0c8dd6 3.95%,
				#1aa0ec 19.37%,
				#60c6ff 34.78%,
				#9bdbff 50.19%,
				#b4deda 65.61%,
				#ffd66b 81.02%,
				#ffc178 96.44%,
				#fe9255 111.85%
				);
			top: 0;
			left: 0;
			transition: 650ms 350ms ease;
			z-index: 1001;
		}

		&.initBg {
			background: linear-gradient(
			0deg,
			rgba(255, 255, 255, 0.8),
			rgba(255, 255, 255, 0.8)
			),
			linear-gradient(
			133.86deg,
			#102f7e -11.47%,
			#0c8dd6 3.95%,
			#1aa0ec 19.37%,
			#60c6ff 34.78%,
			#9bdbff 50.19%,
			#b4deda 65.61%,
			#ffd66b 81.02%,
			#ffc178 96.44%,
			#fe9255 111.85%
			);
		}
	}

	.loaded {
		&::after {
			opacity: 0;
			visibility: hidden;
		}
	}

	.weather__error {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 50px;
		background-color: #0d1d532e;
		border: 1px solid #0d1d53;
		border-radius: 16px;
		padding: 20px;
		max-width: 400px;
		width: 100%;
		text-align: center;

		@media screen and (max-width: 768px) {
            padding: 10px;
        };

		@media screen and (max-width: 500px) {
            max-width: 85%;
        };

		@media screen and (max-height: 680px) {
            padding: 5px;
			top: 20px;

			.weather__error-msg {
				font-size: 16px;
			}
        };

		@media screen and (max-height: 620px) {
			top: 7px;
        };
    }

	.weather__error-msg {
        font-size: 20px;
		color: #0d1d53;
		font-weight: 600;

		@media screen and (max-width: 550px) {
            font-size: 18px;
        };
	}
</style>
