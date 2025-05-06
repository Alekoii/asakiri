<script lang="ts">
	import NavBar from '$layouts/NavBar.svelte';
	import Footer from '$layouts/Footer.svelte';
	import Button from '$components/common/Button.svelte';
	import TopHeader from '$layouts/TopHeader.svelte';
</script>

<svelte:head>
	<title>About Asakiri | Human Curated Open Source Language Learning</title>
	<meta
		name="description"
		content="Asakiri is an open source language learning platform focused on human curated content and federated learning communities. No AI, just real people teaching languages."
	/>
	<meta property="og:title" content="About Asakiri | Human Curated Language Learning" />
	<meta
		property="og:description"
		content="An open source language learning platform with federation capabilities, created by humans for humans."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<TopHeader />
<NavBar />

<div class="about-page">
	<header class="about-header">
		<h1>About Asakiri</h1>
		<p class="tagline">Open Source Language Learning by Humans, for Humans</p>
	</header>

	<section class="mission-section">
		<div class="container">
			<h2>Our Mission</h2>
			<p>
				Asakiri was created to provide a platform where language enthusiasts, teachers and learners
				can connect through genuine human interaction and carefully crafted content. We believe that
				language learning is fundamentally a human experience that thrives on cultural context,
				personal connections and expert guidance.
			</p>
			<p>
				Our mission is to create an ecosystem where language learning is accessible, effective and
				rooted in authentic human to human instruction rather than algorithmic approaches.
			</p>
		</div>
	</section>

	<section class="features-section">
		<div class="container">
			<h2>Key Principles</h2>

			<div class="features-grid">
				<div class="feature-card">
					<h3>Human-Curated Content</h3>
					<p>
						Every course on Asakiri is created by real language teachers and enthusiasts. We focus
						exclusively on human curated content that incorporates cultural nuances, practical
						examples and pedagogical expertise that only human teachers can provide.
					</p>
				</div>

				<div class="feature-card">
					<h3>Zero AI Dependency</h3>
					<p>
						Unlike many modern platforms, Asakiri is completely free of AI generated content and AI
						driven interactions. We believe that language learning requires human judgment, empathy
						and cultural understanding that cannot be replicated by algorithms. Our platform is
						built by humans, for humans.
					</p>
				</div>

				<div class="feature-card">
					<h3>Open Source Foundation</h3>
					<p>
						Asakiri is built as an open source project, which means our code is transparent,
						community-driven, and continuously improved by contributors who share our vision. This
						approach ensures that our platform evolves based on the real needs of language learners
						and teachers.
					</p>
				</div>

				<div class="feature-card">
					<h3>Federation Capabilities</h3>
					<p>
						Our federation system allows multiple Asakiri instances to discover and share courses
						with each other, creating a decentralized network of language learning communities. This
						means courses created on one instance can be discovered by learners on another.
						Expanding access to quality language instruction worldwide.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="how-it-works">
		<div class="container">
			<h2>How Asakiri Works</h2>

			<div class="workflow">
				<div class="workflow-step">
					<div class="step-number">1</div>
					<h3>Human-Created Courses</h3>
					<p>
						Language experts create structured courses with grammar lessons, vocabulary practice,
						and reading exercises based on their expertise and teaching experience.
					</p>
				</div>

				<div class="workflow-step">
					<div class="step-number">2</div>
					<h3>Community Review</h3>
					<p>
						Content undergoes peer review by other language enthusiasts, ensuring accuracy and
						pedagogical soundness without relying on automated systems.
					</p>
				</div>

				<div class="workflow-step">
					<div class="step-number">3</div>
					<h3>Federated Learning</h3>
					<p>
						Courses become available across connected Asakiri instances. Allowing communities to
						share resources while maintaining local governance.
					</p>
				</div>

				<div class="workflow-step">
					<div class="step-number">4</div>
					<h3>Human Interaction</h3>
					<p>
						Learners progress through materials with real feedback from course creators and
						community members. Enabling authentic language acquisition.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="federation-section">
		<div class="container">
			<h2>Federation: Connected Learning Communities</h2>
			<p>
				Asakiri embraces the principles of the federated web through our federation system. Allowing
				independent instances to discover and share courses with each other.
			</p>

			<div class="federation-illustration">
				<div class="instance-node main">
					<span>Your Instance</span>
				</div>
				<div class="connection-lines">
					<div class="line line-2"></div>
				</div>
				<div class="federated-instances">
					<div class="instance-node">
						<span>University Instance</span>
					</div>
					<div class="instance-node">
						<span>Community Instance</span>
					</div>
					<div class="instance-node">
						<span>Language School Instance</span>
					</div>
				</div>
			</div>

			<p>
				This approach means that any organization, school or community can host their own Asakiri
				instance while still benefiting from courses created elsewhere. It creates a resilient
				ecosystem where content is shared without centralized control.
			</p>

			<div class="federation-benefits">
				<div class="benefit">
					<h4>Local Governance</h4>
					<p>Each instance can set its own moderation and content standards</p>
				</div>
				<div class="benefit">
					<h4>Content Sharing</h4>
					<p>Access to courses created across the federated network</p>
				</div>
				<div class="benefit">
					<h4>Community Ownership</h4>
					<p>Host your own instance while staying connected</p>
				</div>
			</div>
		</div>
	</section>

	<section class="open-source-section">
		<div class="container">
			<h2>Open Source at Heart</h2>
			<p>
				Asakiri is developed as an open source project, inviting contributions from developers,
				language teachers and enthusiasts worldwide. Our codebase is transparent and community
				driven.
			</p>

			<div class="github-card">
				<div class="github-info">
					<h3>Join Our Development</h3>
					<p>Contribute to our codebase, report issues or suggest improvements on GitHub.</p>
					<Button href="https://github.com/Alekoii/asakiri" variant="secondary" size="medium"
						>View on GitHub</Button
					>
				</div>
			</div>

			<div class="contribution-ways">
				<h3>Ways to Contribute</h3>
				<ul>
					<li>Code contributions to improve the platform</li>
					<li>Documentation and translation of the interface</li>
					<li>Feature suggestions and bug reports</li>
					<li>Helping others setup instances</li>
					<li>Creating courses and educational content</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="join-section">
		<div class="container">
			<h2>Join Our Human-Centered Learning Movement</h2>
			<p>
				Whether you're a language learner, teacher or developer, there's a place for you in our
				community. Join us in building a more human approach to language learning.
			</p>
			<div class="cta-buttons">
				<Button href="/auth/register" variant="primary" size="medium">Join Asakiri</Button>
				<Button href="/course/create" variant="secondary" size="medium">Create a Course</Button>
				<Button href="https://github.com/Alekoii/asakiri" variant="secondary" size="medium"
					>Contribute</Button
				>
			</div>
		</div>
	</section>
</div>

<Footer />

<style>
	.about-page {
		color: var(--color-neutral-900);
	}

	.about-header {
		text-align: center;
		padding: var(--padding-xl) var(--padding-lg);
		background-color: var(--color-neutral-50);
		border-bottom: 1px solid var(--color-neutral-200);
	}

	.about-header h1 {
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--gap-sm);
	}

	.tagline {
		font-size: var(--text-xl);
		color: var(--color-neutral-600);
	}

	.container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 var(--padding-lg);
	}

	section {
		padding: var(--padding-xl) 0;
	}

	section:nth-child(even) {
		background-color: var(--color-neutral-50);
	}

	h2 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--gap-xl);
		text-align: center;
	}

	h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--gap-md);
	}

	h4 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin-bottom: var(--gap-sm);
	}

	p {
		margin-bottom: var(--gap-md);
		line-height: 1.6;
	}

	.mission-section p {
		font-size: var(--text-lg);
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--gap-xl);
		margin-top: var(--gap-xl);
	}

	.feature-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
	}

	.workflow {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: var(--gap-lg);
		margin-top: var(--gap-xl);
	}

	.workflow-step {
		text-align: center;
		position: relative;
	}

	.step-number {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--color-primary-500);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		margin: 0 auto var(--gap-md);
	}

	.federation-illustration {
		margin: var(--gap-xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.instance-node {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-sm);
		padding: var(--padding-sm) var(--padding-md);
		margin-bottom: var(--gap-md);
		min-width: 150px;
		text-align: center;
	}

	.instance-node.main {
		background-color: var(--color-primary-100);
		border-color: var(--color-primary-300);
		font-weight: var(--font-semibold);
	}

	.connection-lines {
		position: relative;
		height: 50px;
		width: 100%;
		max-width: 600px;
	}

	.line {
		position: absolute;
		top: 0;
		left: 50%;
		height: 50px;
		width: 2px;
		background-color: var(--color-neutral-300);
	}

	.line-2 {
		transform: rotate(0);
	}

	.federated-instances {
		display: flex;
		gap: var(--gap-xl);
		flex-wrap: wrap;
		justify-content: center;
	}

	.federation-benefits {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--gap-lg);
		margin-top: var(--gap-xl);
		text-align: center;
	}

	.github-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		margin: var(--gap-xl) 0;
		text-align: center;
	}

	.contribution-ways {
		margin-top: var(--gap-xl);
	}

	.contribution-ways ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--gap-md);
		list-style-type: none;
		padding: 0;
		margin-top: var(--gap-lg);
	}

	.contribution-ways li {
		background-color: var(--color-neutral-0);
		padding: var(--padding-md);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-200);
	}

	.join-section {
		text-align: center;
		background-color: var(--color-primary-50);
	}

	.join-section .container {
		max-width: 800px;
	}

	.cta-buttons {
		display: flex;
		gap: var(--gap-md);
		justify-content: center;
		margin-top: var(--gap-xl);
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.federated-instances {
			flex-direction: column;
			align-items: center;
		}

		.connection-lines {
			height: 100px;
		}

		.workflow {
			gap: var(--gap-xl);
		}

		.workflow-step:not(:last-child)::after {
			display: none;
		}
	}
</style>
