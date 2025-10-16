<div>
	<h1>CSS Transform</h1>
	<p>This page demonstrates CSS transform properties.</p>
	<div class="box rotate">Rotated Box</div>
	<div class="box scale">Scaled Box</div>
	<div class="box translate">Translated Box</div>
    <div class="box animation-3d">Animated Box</div>
</div>

<style>
	.box {
		width: 100px;
		height: 100px;
		margin: 20px;
		background-color: lightcoral;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
	}
	.rotate {
		transform: rotate(15deg);
	}
	.scale {
		transform: scale(1.5);
	}
	.translate {
		transform: translate(20px, 20px);
	}

	.animation-3d {
		animation: color 4s infinite;
        animation: translation3d 4s infinite;
        transform-style: preserve-3d;
        perspective: 1000px;
	}

	@keyframes colors {
		from {
			background-color: red;
		}
		to {
			background-color: yellow;
		}
	}

    @keyframes translation3d {
        0% {
            transform: translateZ(0) rotateY(0deg) skew(0);
            background-color: lightcoral;
        }
        50% {
            transform: translateZ(50px) rotateY(180deg) skew(5deg);
            background-color: lightseagreen;
        }
        100% {
            transform: translateZ(0) rotateY(360deg) skew(10deg);
            background-color: lightcoral;
        }
    }
</style>
