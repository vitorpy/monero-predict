<div is-="view">
	<h1>MONERO PREDICTION MARKETS</h1>
	<p>Privacy-preserving prediction markets using FHE and Monero</p>

	<nav>
		<a href="/markets/test-market"><button variant-="primary">Browse Markets</button></a>
		<a href="/bets"><button variant-="secondary">My Bets</button></a>
		<a href="/claim/test-market"><button variant-="secondary">Claim</button></a>
		<a href="/setup"><button variant-="accent">Setup Wallet</button></a>
	</nav>

	<hr />

	<h2>Active Markets</h2>
	<p>No markets available yet. Connect to coordinator to see markets.</p>

	<div style="margin-top: 1em;">
		<span is-="badge" variant-="green">Coordinator: Disconnected</span>
		<span is-="badge" variant-="yellow">Wallet: Not Initialized</span>
	</div>
</div>

<style>
	nav {
		display: flex;
		gap: 0.5em;
		margin: 1em 0;
		flex-wrap: wrap;
	}

	nav a {
		text-decoration: none;
	}
</style>

