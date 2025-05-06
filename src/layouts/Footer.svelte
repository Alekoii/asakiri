
<footer class="footer">
	<div class="footer-content">
		<div class="footer-brand">
			<div class="logo">
				<img src="images/asakiri-logo.svg" alt="Asakiri Logo" width="40px"/>
				<span>Asakiri</span>
			</div>
			<p>Learn languages efficiently with our interconnected learning approach.</p>
		</div>

		<div class="footer-links">
			<div class="link-group">
				<h3>Learn</h3>
				<a href="/">Courses</a>
				<a href="/about">About</a>
				<a href="/guides/instance">Instance Setup Guide</a>
			</div>

			<div class="link-group">
				<h3>Teach</h3>
				<a href="/teacher/courses">My Courses</a>
				<a href="/guides/course">Teacher Guide</a>
			</div>

			<div class="link-group">
				<h3>Company</h3>
				<a href="/about">About Us</a>
				<a href="https://github.com/Alekoii/asakiri" target="_blank">Github</a>
				<a href="/terms">Terms of Service</a>
				<a href="/privacy">Privacy Policy</a>
			</div>
		</div>
	</div>

	<div class="footer-bottom">
		<p>&copy; 2025 Asakiri. All rights reserved.</p>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--color-neutral-0);
		border-top: 1px solid var(--color-neutral-100);
		padding: var(--padding-lg) 0;
		margin-top: var(--gap-xl);
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--padding-lg);
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-xl);
	}

	.footer-brand {
		flex: 1;
		min-width: 250px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--gap-xs);
		color: var(--color-primary-400);
		font-weight: var(--font-bold);
		font-size: var(--text-lg);
		margin-bottom: var(--gap-md);
	}

	.footer-brand p {
		color: var(--color-neutral-600);
		font-size: var(--text-sm);
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-xl);
	}

	.link-group {
		min-width: 150px;
	}

	.link-group h3 {
		font-size: var(--text-md);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--gap-md);
		color: var(--color-neutral-800);
	}

	.link-group a {
		display: block;
		margin-bottom: var(--gap-sm);
		color: var(--color-neutral-600);
		font-size: var(--text-sm);
	}

	.link-group a:hover {
		color: var(--color-primary-400);
	}

	.footer-bottom {
		max-width: 1200px;
		margin: var(--gap-xl) auto 0;
		padding: var(--gap-md) var(--padding-lg) 0;
		border-top: 1px solid var(--color-neutral-100);
		text-align: center;
	}

	.footer-bottom p {
		color: var(--color-neutral-500);
		font-size: var(--text-xs);
	}
</style>
